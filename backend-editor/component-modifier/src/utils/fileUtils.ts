import fs from "fs";
const fs_p = require("fs").promises;
import path from "path";
import yaml from "js-yaml";

export async function createIndexYaml(
  relativeFolderPath,
  removeContent = true
) {
  const folderPath = path.join(__dirname, relativeFolderPath);
  console.log("Resolved folder path:", folderPath);
  const indexYamlPath = path.join(folderPath, "index.yaml");
  const structure = "";

  if (fs.existsSync(indexYamlPath) && removeContent) {
    console.log("index.yaml already exists, deleting it...");
    fs.unlinkSync(indexYamlPath);
  } else if (fs.existsSync(indexYamlPath)) {
    console.log("index.yaml already exists, not deleting it...");
    return [indexYamlPath, folderPath];
  }
  try {
    if (!fs.existsSync(folderPath)) {
      console.log("Folder does not exist, creating it...");
      await fs_p.mkdir(folderPath, { recursive: true, mode: 0o700 });
    }
    await fs_p.writeFile(indexYamlPath, structure, "utf8");
    console.log("index.yaml created successfully!");
    return [indexYamlPath, folderPath];
  } catch (err) {
    console.error("Error creating index.yaml:", err);
  }
}

export async function deleteFile(filePath) {
  try {
    await fs_p.unlink(filePath);
    console.log("File deleted successfully!");
  } catch (err) {
    console.error("Error deleting file:", err);
  }
}
// Function to delete a folder synchronously at a given path
export function deleteFolderSync(folderPath) {
  try {
    fs.rmSync(folderPath, { recursive: true, force: true });
    console.log("Folder successfully deleted");
  } catch (error) {
    console.error("Error deleting the folder:", error);
  }
}
export async function readYamlFile(filePath) {
  try {
    const fileData = await fs_p.readFile(filePath, "utf8");
    return fileData;
  } catch (err) {
    console.error("Error reading YAML file:", err);
    throw err; // Rethrow the error for caller to handle if needed
  }
}

export async function copyDir(
  src,
  dest,
  ignoreFiles = [
    "node_modules",
    ".git",
    "package.json",
    "package-lock.json",
    "README.md",
  ]
) {
  src = path.resolve(__dirname, src);
  dest = path.resolve(__dirname, dest);
  await fs_p.mkdir(dest, { recursive: true });
  const files = await fs_p.readdir(src);
  for (const file of files) {
    if (ignoreFiles.includes(file)) {
      console.log(`Ignoring file: ${file}`);
      continue;
    }
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);
    const stat = await fs_p.stat(srcPath);
    if (stat.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fs_p.copyFile(srcPath, destPath);
    }
  }
  console.log("Folder copied successfully!");
}

// // Example usage:
// const sourceFilePath = "../../ONDC-NTS-Specifications/api/cp0";
// const destinationFilePath = "../history/copy";
// copyDir(sourceFilePath, destinationFilePath);
console.log(__dirname);

// Example usage:
// const sourceFilePath = "../../ONDC-NTS-Specifications/api/cp0/index.yaml";
// const destinationFilePath = "../../ONDC-NTS-Specifications/api/cp1/index.yaml";
// copyYamlFile(sourceFilePath, destinationFilePath);

// (async () => {
//   try {
//     const relativeFolderPath = "../../ONDC-NTS-Specifications/api/cp0";
//     const structure = await getFileStructureRelative(relativeFolderPath);
//     console.log("File structure:", structure);
//   } catch (err) {
//     console.error("Error testing getFileStructureRelative:", err);
//   }
// })();
