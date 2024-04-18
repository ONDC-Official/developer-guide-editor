const fs = require("fs");
const fs_p = require("fs").promises;
const path = require("path");
const yaml = require("js-yaml");

async function createIndexYaml(relativeFolderPath) {
  const folderPath = path.join(__dirname, relativeFolderPath);
  console.log("Resolved folder path:", folderPath);
  const indexYamlPath = path.join(folderPath, "index.yaml");
  const structure = "";

  if (fs.existsSync(indexYamlPath)) {
    console.log("index.yaml already exists!");
    return indexYamlPath;
  }

  try {
    if (!fs.existsSync(folderPath)) {
      console.log("Folder does not exist, creating it...");
      await fs_p.mkdir(folderPath, { recursive: true });
    }
    await fs_p.writeFile(indexYamlPath, structure, "utf8");
    console.log("index.yaml created successfully!");
    return indexYamlPath;
  } catch (err) {
    console.error("Error creating index.yaml:", err);
  }
}

async function deleteFile(filePath) {
  try {
    await fs_p.unlink(filePath);
    console.log("File deleted successfully!");
  } catch (err) {
    console.error("Error deleting file:", err);
  }
}

async function readYamlFile(filePath) {
  try {
    const fileData = await fs_p.readFile(filePath, "utf8");
    return fileData;
  } catch (err) {
    console.error("Error reading YAML file:", err);
    throw err; // Rethrow the error for caller to handle if needed
  }
}

async function copyDir(
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

module.exports = { createIndexYaml, readYamlFile, copyDir, deleteFile };
