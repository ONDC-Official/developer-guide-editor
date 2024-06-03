import { Octokit } from "@octokit/rest";
import fs from "fs";
import path from "path";
import simpleGit, { ResetMode, SimpleGit } from "simple-git";
import { deleteFolderSync } from "../utils/fileUtils";
import { isBinary } from "../utils/fileUtils";

export const forkRepository = async (token: string, repoUrl: string) => {
  const [owner, repo] = repoUrl.replace("https://github.com/", "").split("/");

  const octokit = new Octokit({
    auth: token,
  });

  const retryOperation = async (operation, retries = 3, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
      try {
        return await operation();
      } catch (error) {
        if (i < retries - 1) {
          console.log(`Retrying... (${i + 1}/${retries})`);
          await new Promise((res) => setTimeout(res, delay));
        } else {
          throw error;
        }
      }
    }
  };

  try {
    // Check if the repo is already forked
    const { data: userRepos } = await retryOperation(() =>
      octokit.repos.listForAuthenticatedUser()
    );

    const forkedRepo = userRepos.find((r) => r.name === repo);
    // console.log(userRepos);
    console.log(forkedRepo);
    if (forkedRepo) {
      console.log("Repository is already forked:", forkedRepo.html_url);
      return forkedRepo.html_url;
    }

    // Fork the repository
    const response = await retryOperation(() =>
      octokit.repos.createFork({
        owner,
        repo,
      })
    );

    console.log("Repository forked successfully:", response.data);

    // Get the list of branches from the original repository
    const { data: branches } = await retryOperation(() =>
      octokit.repos.listBranches({
        owner,
        repo,
      })
    );

    const forkedOwner = response.data.owner.login;
    const forkedRepoName = response.data.name;

    for (const branch of branches) {
      const branchName = branch.name;
      console.log(`Processing branch: ${branchName}`);

      try {
        // Get the commit SHA of the branch
        const { data: branchData } = await octokit.repos.getBranch({
          owner,
          repo,
          branch: branchName,
        });

        // Create the branch in the forked repository
        await octokit.git.createRef({
          owner: forkedOwner,
          repo: forkedRepoName,
          ref: `refs/heads/${branchName}`,
          sha: branchData.commit.sha,
        });

        console.log(`Branch ${branchName} processed successfully.`);
      } catch (error) {
        console.error(
          `Failed to process branch ${branchName}: ${error.message}`
        );
        console.log(`Skipping branch ${branchName}.`);
      }
    }

    console.log("All branches have been processed.");
    const forkedRepoUrl = `https://github.com/${forkedOwner}/${repo}.git`;
    return forkedRepoUrl;
  } catch (error) {
    throw new Error(`Error forking repository: ${error.message}`);
  }
};

/**
 * Clones a GitHub repository using the provided URL and Personal Access Token (PAT).
 * @param {string} token - Your GitHub Personal Access Token.
 * @param {string} repoUrl - The URL of the repository to clone.
 * @param {string} localPath - The local path where the repository should be cloned.
 * @returns {Promise<void>}
 */
export const cloneRepo = async (
  token: string,
  userName: string,
  repoUrl: string
): Promise<void> => {
  const git = simpleGit();

  // Extract the owner and repo from the URL
  const [owner, repo] = repoUrl.replace("https://github.com/", "").split("/");

  // Construct the authenticated URL
  const authenticatedUrl = `https://${token}@github.com/${userName}/${repo}.git`;

  const forkedCompPath = isBinary
    ? path.join(path.dirname(process.execPath), "./FORKED_REPO")
    : "../../../../backend-editor/FORKED_REPO";

  const localPath = path.resolve(__dirname, forkedCompPath);
  try {
    // await deleteFolderSync(localPath);
    if (fs.existsSync(localPath)) {
      const existingRepo = simpleGit(localPath);
      const repoName = await getRepoName(existingRepo);
      if (repoName === repo) {
        console.log("Repository already cloned");

        return;
      } else {
        await deleteFolderSync(localPath);
      }
    }
    await git.clone(authenticatedUrl, localPath);
    const clonedRepo = simpleGit(localPath);

    // Configure the Git user
    await clonedRepo.addConfig("user.name", userName);
    await clonedRepo.addConfig("user.email", "dummy-email@example.com"); // Using a dummy email

    // Add the original repository as upstream remote
    await clonedRepo.addRemote("upstream", repoUrl);
    console.log(`Repository cloned`);
  } catch (error) {
    console.error("Error cloning repository:", error.message);
    throw error;
  }
};

/**
 * Changes the branch of a cloned GitHub repository.
 * @param {string} repoPath - The local path of the cloned repository.
 * @param {string} branchName - The branch name to switch to.
 * @returns {Promise<void>}
 */
export const changeBranch = async (
  repoPath: string,
  branchName: string
): Promise<void> => {
  const git = simpleGit(repoPath);

  const currentBranchSummary = await git.branch();
  let currentBranch = "remotes/" + currentBranchSummary.current;
  currentBranch = extractBranchName(currentBranch);
  console.log(`Current branch is ${currentBranch}`);
  // console.log(git.stashList)

  if (currentBranch === branchName) {
    console.log(`Already on branch ${branchName}`);
    return;
  }

  const stashMessage = `stash@${currentBranch}`;

  try {
    // Stash any current changes with a specific message
    await git.stash(["push", "-u", "-m", stashMessage]);
    console.log(`Stashed changes for branch ${currentBranch}`);

    // Check if the branch exists locally
    const branchSummary = await git.branch();
    if (!branchSummary.all.includes(branchName)) {
      // Fetch the branch from the remote if it does not exist locally
      await git.fetch("origin", branchName);
    }
    // Checkout the branch
    console.log("Checking out branch", branchName);
    await git.checkout(branchName);
    // await git.checkoutBranch(branchName, "origin");
    console.log(`Switched to branch ${branchName}`);

    // Check if there are stashes for the new branch and apply the most recent one
    const stashList = await git.stashList();
    // console.log(stashList.all);
    const branchStashIndex = stashList.all.findIndex((stash) =>
      stash.message.includes(`stash@${extractBranchName(branchName)}`)
    );
    if (branchStashIndex !== -1) {
      await git.stash(["pop", `stash@{${branchStashIndex}}`]);
      console.log(`Applied stash for branch ${branchName}`);
    }
  } catch (error) {
    console.error("Error switching branches:", error.message);
    throw error;
  }
};

export const getBranches = async (repoPath: string) => {
  const git = simpleGit(repoPath);
  const branches = await git.branch();
  // console.log(branches);
  let allBranches = branches.all;
  allBranches = allBranches.filter((b) => b.includes("remotes/origin"));

  return { allBranches: allBranches, currentBranch: branches.current };
};

/**
 * Stashes changes, fetches updates, applies stash, commits with provided message, and pushes to the remote repository.
 * @param {string} repoPath - The local path of the repository.
 * @param {string} commitMessage - The commit message.
 * @returns {Promise<void>}
 */
export const stashFetchCommitAndPushChanges = async (
  repoPath: string,
  commitMessage: string
): Promise<void> => {
  const git = simpleGit(repoPath);
  try {
    const branch = (await git.branch()).current;

    let withoutOrigin = extractBranchName(branch);
    await git.add("./*");
    console.log("Changes added successfully");

    await git.commit(commitMessage);
    console.log("Changes committed successfully");
    console.log("HEAD:" + withoutOrigin);

    const res = await git.push("origin", "HEAD:" + withoutOrigin);

    console.log(res);
    console.log("Changes pushed successfully to branch:", withoutOrigin);
    // git.checkoutBranch(withoutOrigin, "origin/" + withoutOrigin);
    // await git.checkout("remotes")
    console.log("checkout", "remotes/" + branch);
    await git.checkout("master");
    await git.checkout("remotes/" + branch);
    // await changeBranch(repoPath, "remotes/" + branch);
  } catch (error) {
    console.error("Error during commit and push process:", error.message);
    throw error;
  }
};

export const raisePr = async (
  token: string,
  repoUrl: string,
  repoPath: string,
  prTitle: string,
  prBody: string,
  extractedBranchName: string
) => {
  // Create a PR
  try {
    const octokit = new Octokit({
      auth: token,
    });
    // const git = simpleGit(repoPath);
    const [owner, repo] = repoUrl.replace("https://github.com/", "").split("/");

    // const branchName = extractBranchName((await git.branch()).current);

    console.log("Branch Name", extractedBranchName);
    const {
      data: { login: forkedOwner },
    } = await octokit.users.getAuthenticated();
    console.log("fileds", {
      owner,
      repo,
      title: prTitle,
      body: prBody,
      head: `${forkedOwner}:${extractedBranchName}`,
      base: extractedBranchName,
    });
    const { data: pullRequest } = await octokit.pulls.create({
      owner,
      repo,
      title: prTitle,
      body: prBody,
      head: `${forkedOwner}:${extractedBranchName}`,
      base: extractedBranchName,
    });
    return pullRequest.html_url;
  } catch (e) {
    console.log("Error creating PR");
    console.log(e.message);
    throw new Error(`Error creating PR: ${e.message}`);
  }
  // console.log("Pull Request created successfully:", pullRequest.html_url);
};

export async function getStatus(repoPath: string) {
  const git = simpleGit(repoPath);
  return await git.status();
}

const getRepoName = async (git: SimpleGit) => {
  const remote = await git.listRemote(["--get-url"]);
  const repoName = remote.split("/").pop()?.split(".git")[0];
  return repoName;
};

/**
 * Resets the current branch by fetching, clearing local changes, and pulling the latest changes.
 * @param {string} repoPath - The local path of the cloned repository.
 * @returns {Promise<void>}
 */
export const resetCurrentBranch = async (repoPath: string): Promise<void> => {
  const git = simpleGit(repoPath);
  // console.log(await printAllRemotes(git));
  try {
    // Get the current branch name
    const currentBranchSummary = await git.branch();
    const currentBranch = currentBranchSummary.current;
    const stashMessage = `stash@${currentBranch}`;

    console.log(`Current branch is ${currentBranch}`);

    // Fetch all branches to ensure local and remote branches are up to date
    await git.fetch(["upstream"]);
    console.log("Fetched all branches from remote");

    // Stash any current changes, including untracked files, with a specific message
    await git.stash(["push", "-u", "-m", stashMessage]);
    console.log(`Stashed changes for branch ${currentBranch}`);

    // Pull the latest changes from the remote repository
    let withoutOrigin = currentBranch;
    if (currentBranch.includes("origin")) {
      withoutOrigin = currentBranch.split("/")[1];
    }
    console.log("withoutOrigin", withoutOrigin);
    await git.reset(ResetMode.HARD);
    await git.pull("origin", withoutOrigin);
    console.log(
      `Pulled latest changes from upstream for branch ${currentBranch}`
    );

    // Check for and delete the stash associated with this branch
    const stashList = await git.stashList();
    const branchStashIndex = stashList.all.findIndex((stash) =>
      stash.message.includes(stashMessage)
    );
    if (branchStashIndex !== -1) {
      await git.stash(["drop", `stash@{${branchStashIndex}}`]);
      console.log(`Deleted stash for branch ${currentBranch}`);
    }
  } catch (error) {
    console.error("Error resetting branch:", error.message);
    throw error;
  }
};

export const printAllRemotes = async (git: SimpleGit): Promise<void> => {
  try {
    // Get the list of all remote repositories
    const remotes = await git.getRemotes(true);
    if (remotes.length === 0) {
      console.log("No remote repositories found.");
      return;
    }

    console.log("Remote repositories:");
    remotes.forEach((remote) => {
      console.log(`Name: ${remote.name}`);
      console.log(`Fetch URL: ${remote.refs.fetch}`);
      console.log(`Push URL: ${remote.refs.push}`);
      console.log("---");
    });
  } catch (error) {
    console.error("Error fetching remote repositories:", error.message);
    throw error;
  }
};

/**
 * Extracts the branch name by removing the remote prefix (e.g., 'origin/')
 * and any other similar prefixes.
 *
 * @param fullBranchName - The full branch name, potentially with a remote prefix.
 * @returns The branch name without the remote prefix.
 */
export function extractBranchName(fullBranchName: string): string {
  // Split the branch name by '/'
  const parts = fullBranchName.split("/");

  // Return the last part of the split array, which is the actual branch name
  return parts[parts.length - 1];
}

// (async () => {
//   const token = "";
//   const url = "https://github.com/ONDC-Official/ONDC-FIS-Specifications";
//   const userName = "rudranshOndc";
//   const repoPath = path.resolve(
//     __dirname,
//     "../../../../backend-editor/FORKED_REPO"
//   );
//   // await getBranches(repoPath);
//   //   await forkRepository(token, url);
//   //   await cloneRepo(token, userName, url);
//   //   await changeBranch(
//   //     path.resolve(__dirname, "../../../../backend-editor/FORKED_REPO"),
//   //     "release-FIS12-2.0.0"
//   //   );
//   // console.log(await getStatus(repoPath));
//   // changeBranch(repoPath, "master");
//   // await stashFetchCommitAndPushChanges(repoPath, "testing commit");
//   // await new Promise((resolve) => setTimeout(resolve, 2000));
//   // console.log(await getBranches(repoPath));
//   // await raisePr(token, url, repoPath, "Test PR", "This is a test PR");
//   // await resetCurrentBranch(repoPath);
// })();
