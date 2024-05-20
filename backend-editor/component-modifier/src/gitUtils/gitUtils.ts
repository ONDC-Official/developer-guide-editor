import { Octokit } from "@octokit/rest";
import { execSync } from "child_process";
import path from "path";
import simpleGit from "simple-git";

const forkRepository = async (token: string, repoUrl: string) => {
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
const cloneRepo = async (
  token: string,
  userName: string,
  repoUrl: string
): Promise<void> => {
  const git = simpleGit();

  // Extract the owner and repo from the URL
  const [owner, repo] = repoUrl.replace("https://github.com/", "").split("/");

  // Construct the authenticated URL
  const authenticatedUrl = `https://${token}@github.com/${userName}/${repo}.git`;

  try {
    await git.clone(
      authenticatedUrl,
      path.resolve(__dirname, "../../../../backend-editor/FORKED_REPO")
    );
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
const changeBranch = async (
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

(async () => {
  const token = "";
  const url = "https://github.com/ONDC-Official/ONDC-FIS-Specifications";
  const userName = "rudranshOndc";
  //   await forkRepository(token, url);
  await cloneRepo(token, userName, url);
  await changeBranch(
    path.resolve(__dirname, "../../../../backend-editor/FORKED_REPO"),
    "release-FIS12-2.0.0"
  );
})();
