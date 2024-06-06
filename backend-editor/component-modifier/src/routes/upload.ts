import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { deleteFolderSync } from "../utils/fileUtils";
import axios from "axios";
import archiver from "archiver";
export const app = express();

const folderPath = path.resolve(
  __dirname,
  "../../../FORKED_REPO/api/components"
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const basePath = folderPath;
    const relativePath = path.dirname(file.originalname);

    // Split the path into components
    const pathComponents = relativePath.split("/");
    const modifiedPathComponents = pathComponents.slice(1);

    const modifiedPath = path.join(...modifiedPathComponents);
    const uploadPath = path.join(basePath, modifiedPath);

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

  archive.directory(folderPath, false);

  archive.finalize();
});
