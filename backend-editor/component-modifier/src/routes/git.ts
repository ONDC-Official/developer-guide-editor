import express from "express";
import {
  changeBranch,
  cloneRepo,
  forkRepository,
  getBranches,
  getStatus,
  raisePr,
  resetCurrentBranch,
  stashFetchCommitAndPushChanges,
} from "../gitUtils/gitUtils";
import path from "path";
import axios from "axios";

export const app = express();
app.use(express.json());

app.post("/init", async (req, res) => {
  let link = "";
  const { username, repoUrl, token } = req.body;
  if (!username || !repoUrl || !token) {
    res.status(400).send("Missing required parameters");
    return;
  }
  try {
    link = await forkRepository(token, repoUrl);
    await cloneRepo(token, username, repoUrl);
  } catch {
    res.status(500).send("Error initializing repository");
    return;
  }
  res.status(200).send(link);
});

app.get("/branches", async (req, res) => {
  try {
    const branches = await getBranches(
      path.resolve(__dirname, "../../../../backend-editor/FORKED_REPO")
    );
    res.status(200).send(branches);
  } catch (err) {
    res.status(500).send("Error fetching branches");
  }
});

app.post("/changeBranch", async (req, res) => {
  const { branchName } = req.body;
  if (!branchName) {
    res.status(400).send("Missing required parameters");
  }
  try {
    await changeBranch(
      path.resolve(__dirname, "../../../../backend-editor/FORKED_REPO"),
      branchName
    );
    await axios.post("http://localhost:1000/tree/reload");

    res.status(200).send("Branch changed successfully");
  } catch (err) {
    res.status(500).send("Error changing branch");
  }
});

app.get("/status", async (req, res) => {
  try {
    const status = await getStatus(
      path.resolve(__dirname, "../../../../backend-editor/FORKED_REPO")
    );
    res.status(200).send(JSON.stringify(status, null, 2));
  } catch (err) {
    res.status(500).send("Error fetching status");
  }
});

app.delete("/reset", async (req, res) => {
  try {
    await resetCurrentBranch(
      path.resolve(__dirname, "../../../../backend-editor/FORKED_REPO")
    );
    await axios.post("http://localhost:1000/tree/reload");
    res.status(200).send("Reset successful");
  } catch (err) {
    res.status(500).send("Error resetting repository");
  }
});

app.post("/openPR", async (req, res) => {
  const { message, title, token, url } = req.body;
  if (!message || !title || !token || !url) {
    res.status(400).send("Missing required parameters");
  }
  try {
    const repoPath = path.resolve(
      __dirname,
      "../../../../backend-editor/FORKED_REPO"
    );
    await stashFetchCommitAndPushChanges(repoPath, message);
    await raisePr(token, url, repoPath, title, message);
    res.status(200).send("PR created successfully");
  } catch (err) {
    res.status(500).send("Error creating PR");
  }
});
