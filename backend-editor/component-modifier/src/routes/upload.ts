import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { deleteFolderSync } from "../utils/fileUtils";
import axios from "axios";
import archiver from "archiver";
import { exec } from "child_process";
export const app = express();

const BASE_PATH = path.resolve(__dirname, "../../../FORKED_REPO");
const COMP_FOL_PATH = path.resolve(
  __dirname,
  "../../../FORKED_REPO/api/components"
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const relativePath = path.dirname(file.originalname);

    // Split the path into components
    const pathComponents = relativePath.split("/");
    const modifiedPathComponents = pathComponents.slice(1);

    const modifiedPath = path.join(...modifiedPathComponents);

    const uploadPath = path.join(BASE_PATH, modifiedPath);

    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, path.basename(file.originalname));
  },
});

const upload = multer({ storage: storage, preservePath: true }).array("files");

app.post("/upload", async (req, res) => {
  await deleteFolderSync(path.resolve(__dirname, "../../../FORKED_REPO"));
  console.log("POST /local/upload Request Body:", req.body);
  upload(req, res, (err) => {
    if (err) {
      return res.status(500).json({ message: "Upload failed", error: err });
    }
    axios.delete("http://localhost:1000/tree/sessions");
    res.status(200).json({ message: "Files uploaded successfully" });
  });
});

app.get("/download", (req, res) => {
  const outPath = path.join(__dirname, "comp.zip");
  const output = fs.createWriteStream(outPath);
  const archive = archiver("zip", {
    zlib: { level: 9 },
  });

  output.on("close", () => {
    res.download(outPath, "components.zip", (err) => {
      if (err) {
        console.error("Error downloading file:", err);
        res.status(500).send("Error downloading file");
      }
      fs.unlinkSync(outPath);
    });
  });

  archive.on("error", (err) => {
    throw err;
  });

  archive.pipe(output);

  archive.directory(COMP_FOL_PATH, false);

  archive.finalize();
});

const predefinedPath = path.resolve(__dirname, "../../../FORKED_REPO");

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
