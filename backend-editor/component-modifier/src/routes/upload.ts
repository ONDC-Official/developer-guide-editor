import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { deleteFolderSync } from "../utils/fileUtils";
import axios from "axios";
import archiver from "archiver";
import { exec } from "child_process";
import { isBinary } from "../utils/fileUtils";
import os from "os";

const forkedRepoFolderPath = isBinary
  ? path.join(path.dirname(process.execPath), "./FORKED_REPO")
  : `../../../FORKED_REPO`;

const forkedRepoFullPath = isBinary
  ? path.join(path.dirname(process.execPath), "./FORKED_REPO/api/components")
  : `../../../FORKED_REPO/api/components`;

const outPath = isBinary
  ? path.join(path.dirname(process.execPath), "comp.zip")
  : path.join(__dirname, "comp.zip");

export const app = express();

const BASE_PATH = path.resolve(__dirname, forkedRepoFolderPath);
const COMP_FOL_PATH = path.resolve(__dirname, forkedRepoFullPath);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const relativePath = path.dirname(file.originalname);

    // Split the path into components
    console.log("Relative Path:", relativePath);
    const pathComponents = relativePath.split("/");
    const modifiedPathComponents = pathComponents.slice(1);

    const modifiedPath = path.join(...modifiedPathComponents);
    let uploadPath;

    try {
      uploadPath = path.join(BASE_PATH, modifiedPath);
      fs.mkdirSync(uploadPath, { recursive: true });
    } catch {
      console.log("printing error", path.join(BASE_PATH, modifiedPath));
    }
    console.log("Upload Path:", uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, path.basename(file.originalname));
  },
});

const upload = multer({ storage: storage, preservePath: true }).array("files");

app.post("/upload", async (req, res) => {
  await deleteFolderSync(path.resolve(__dirname, forkedRepoFolderPath));
  console.log("POST /local/upload Request Body:", req.body);
  upload(req, res, (err) => {
    if (err) {
      return res.status(500).json({ message: "Upload failed", error: err });
    }
    axios.delete("http://localhost:1000/tree/sessions");
    res.status(200).json({ message: "Files uploaded successfully" });
  });
});

// Helper function to delete a folder recursively
const deleteFolderRecursive = async (folderPath) => {
  if (fs.existsSync(folderPath)) {
    for (const file of await fs.promises.readdir(folderPath)) {
      const curPath = path.join(folderPath, file);
      if ((await fs.promises.lstat(curPath)).isDirectory()) {
        await deleteFolderRecursive(curPath);
      } else {
        await fs.promises.unlink(curPath);
      }
    }
    await fs.promises.rmdir(folderPath);
  }
};

app.get("/download", async (req, res) => {
  // Create a temporary directory for the zip file
  const tempDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), "comp-"));
  const outPath = path.join(tempDir, "comp.zip");

  const output = fs.createWriteStream(outPath);
  const archive = archiver("zip", {
    zlib: { level: 9 },
  });

  output.on("close", async () => {
    res.download(outPath, "components.zip", async (err) => {
      if (err) {
        console.error("Error downloading file:", err);
        res.status(500).send("Error downloading file");
      } else {
        try {
          await fs.promises.unlink(outPath); // Clean up the zip file after download
          await deleteFolderRecursive(tempDir); // Clean up the temporary directory
        } catch (err) {
          console.error("Error cleaning up:", err);
        }
      }
    });
  });

  archive.on("error", (err) => {
    console.error("Archive error:", err);
    res.status(500).send("Error creating archive");
  });

  archive.pipe(output);

  // Ensure COMP_FOL_PATH exists and is accessible
  if (fs.existsSync(COMP_FOL_PATH)) {
    archive.directory(COMP_FOL_PATH, false);
    archive.finalize();
  } else {
    console.error("Components folder path does not exist:", COMP_FOL_PATH);
    res.status(500).send("Components folder path does not exist");
  }
});

const predefinedPath = path.resolve(__dirname, forkedRepoFolderPath);

app.get("/terminal", (req, res) => {
  exec(`start cmd /K "cd ${predefinedPath}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return res.status(500).send(`Error: ${error.message}`);
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`);
      return res.status(500).send(`Stderr: ${stderr}`);
    }
    console.log(`Stdout: ${stdout}`);
    res.send("Terminal opened at FORKDED REPO");
  });
});
