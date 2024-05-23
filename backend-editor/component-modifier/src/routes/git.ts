import express from "express";
import {
  changeBranch,
  cloneRepo,
  forkRepository,
  getBranches,
} from "../gitUtils/gitUtils";
import path from "path";
import axios from "axios";

export const app = express();
app.use(express.json());

app.post("/init", async (req, res) => {
  const { username, repoUrl, token } = req.body;
  if (!username || !repoUrl || !token) {
    res.status(400).send("Missing required parameters");
    return;
  }
  try {
    await forkRepository(token, repoUrl);
    await cloneRepo(token, username, repoUrl);
  } catch {
    res.status(500).send("Error initializing repository");
    return;
  }
  res.status(200).send("Repository initialized successfully");
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
    await axios.post("http://localhost:1000/reload");
    res.status(200).send("Branch changed successfully");
  } catch (err) {
    res.status(500).send("Error changing branch");
  }
});
