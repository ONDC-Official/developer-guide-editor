import { Octokit } from "@octokit/rest";
import { execSync } from "child_process";
import path from "path";
import simpleGit from "simple-git";
import { deleteFolderSync } from "../utils/fileUtils";

export const forkRepository = async (token: string, repoUrl: string) => {
  // Extract the owner and repo from the URL
  const [owner, repo] = repoUrl.replace("https://github.com/", "").split("/");

  const octokit = new Octokit({
    auth: token,
  });

  try {
    // Fork the repository
    const response = await octokit.repos.createFork({
      owner,
      repo,
    });

    console.log("Repository forked successfully:", response.data);

    // Get the list of branches from the original repository
    const { data: branches } = await octokit.repos.listBranches({
      owner,
      repo,
    });

    const forkedOwner = response.data.owner.login;

    for (const branch of branches) {
      const branchName = branch.name;
      console.log(`Processing branch: ${branchName}`);

      // Push each branch to the forked repository
      const branchUrl = `https://github.com/${forkedOwner}/${repo}.git`;
      execSync(`git fetch ${repoUrl} ${branchName}`);
      execSync(
        `git push ${branchUrl} refs/remotes/origin/${branchName}:refs/heads/${branchName}`
      );
    }
    const forkedRepoUrl = `https://github.com/${forkedOwner}/${repo}.git`;
    console.log("All branches have been forked successfully.");
    return forkedRepoUrl;
  } catch (error) {
    console.error(
      "Error forking repository:",
      error.response ? error.response.data : error.message
    );
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
  const localPath = path.resolve(
    __dirname,
    "../../../../backend-editor/FORKED_REPO"
  );
  try {
    await deleteFolderSync(localPath);
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

  try {
    // Check if the branch exists locally
    const branchSummary = await git.branch();
    if (!branchSummary.all.includes(branchName)) {
      // Fetch the branch from the remote if it does not exist locally
      await git.fetch("origin", branchName);
    }
    // Checkout the branch
    await git.checkout(branchName);
    console.log(`Switched to branch ${branchName}`);
  } catch (error) {
    console.error("Error switching branches:", error.message);
    throw error;
  }
};

export const getBranches = async (repoPath: string) => {
  const git = simpleGit(repoPath);
  const branches = await git.branch();
  return branches.all;
};

/**
 * Stashes changes, fetches updates, applies stash, commits with provided message, and pushes to the remote repository.
 * @param {string} repoPath - The local path of the repository.
 * @param {string} commitMessage - The commit message.
 * @returns {Promise<void>}
 */
const stashFetchCommitAndPushChanges = async (
  repoPath: string,
  commitMessage: string
): Promise<void> => {
  const git = simpleGit(repoPath);
  console.log("status", git.status());
  try {
    // Stash local changes
    await git.stash();
    // Fetch updates from remote
    // const branch = (await git.branch()).current;
    // await git.fetch("upstream", branch);
    await git.fetch();

    // Apply the stashed changes
    await git.stash(["pop"]);

    // Stage all changes
    await git.add("./*");

    // Commit changes with the provided message
    await git.commit(commitMessage);

    // Push changes to the remote repository
    await git.push();

    console.log("Changes pushed successfully.");
  } catch (error) {
    console.error("Error during commit and push process:", error.message);
    throw error;
  }
};

const raisePr = async (
  token: string,
  repoUrl: string,
  repoPath: string,
  prTitle: string,
  prBody: string
) => {
  // Create a PR
  const octokit = new Octokit({
    auth: token,
  });
  const git = simpleGit(repoPath);
  const [owner, repo] = repoUrl.replace("https://github.com/", "").split("/");

  const branchName = (await git.branch()).current;
  const {
    data: { login: forkedOwner },
  } = await octokit.users.getAuthenticated();
  const { data: pullRequest } = await octokit.pulls.create({
    owner,
    repo,
    title: prTitle,
    body: prBody,
    head: `${forkedOwner}:${branchName}`,
    base: branchName,
  });

  console.log("Pull Request created successfully:", pullRequest.html_url);
};

(async () => {
  const token = "";
  const url = "https://github.com/ONDC-Official/ONDC-FIS-Specifications";
  const userName = "rudranshOndc";
  const repoPath = path.resolve(
    __dirname,
    "../../../../backend-editor/FORKED_REPO"
  );
  //   await forkRepository(token, url);
  //   await cloneRepo(token, userName, url);
  //   await changeBranch(
  //     path.resolve(__dirname, "../../../../backend-editor/FORKED_REPO"),
  //     "release-FIS12-2.0.0"
  //   );
  await stashFetchCommitAndPushChanges(repoPath, "testing commit");
  await raisePr(token, url, repoPath, "Test PR", "This is a test PR");
})();
