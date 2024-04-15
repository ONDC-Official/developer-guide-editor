const fs = require("fs");
const fs_p = require("fs").promises;
const path = require("path");

function displayFolderNames(relativeFolderPath, ignoreFolders = []) {
  // Convert the relative path to an absolute path based on the current file location
  const folderPath = path.join(__dirname, relativeFolderPath);

  console.log("Resolved folder path:", folderPath);
  fs.readdir(folderPath, { withFileTypes: true }, (err, entries) => {
    if (err) {
      console.error("Error reading folder:", err);
      return;
    }
    const folderNames = [];
    console.log("Folders in folder:");
    entries.forEach((entry) => {
      if (entry.isDirectory() && !ignoreFolders.includes(entry.name)) {
        console.log(entry.name);
        folderNames.push(entry.name);
      }
    });
    return folderNames;
  });
}

async function getFileStructure(
  dirPath,
  basePath = dirPath,
  ignoreFolders = []
) {
  try {
    const entries = await fs_p.readdir(dirPath, { withFileTypes: true });
    const structure = (
      await Promise.all(
        entries.map(async (entry) => {
          const entryPath = path.join(dirPath, entry.name);
          const relativePath = path.relative(basePath, entryPath);
          if (entry.isDirectory() && !ignoreFolders.includes(entry.name)) {
            return {
              type: "directory",
              name: entry.name,
              path: relativePath,
              children: await getFileStructure(
                entryPath,
                basePath,
                ignoreFolders
              ),
            };
          } else if (!ignoreFolders.includes(entry.name)) {
            return { type: "file", name: entry.name, path: relativePath };
          }
          // Implicitly return undefined for ignored folders or files
        })
      )
    ).filter((item) => item !== undefined);
    return structure;
  } catch (err) {
    console.error("Error reading directory:", err);
    throw err; // Rethrow the error for caller to handle if needed
  }
}

async function getFileStructureRelative(relativeFolderPath) {
  const folderPath = path.join(__dirname, relativeFolderPath);
  return getFileStructure(folderPath, __dirname, [
    "node_modules",
    "package-lock.json",
    "package.json",
    "app.js",
    "build-attributes.js",
  ]);
}

async function createIndexYaml(relativeFolderPath) {
  const folderPath = path.join(__dirname, relativeFolderPath);
  console.log("Resolved folder path:", folderPath);
  const indexYamlPath = path.join(folderPath, "index.yaml");
  const structure = "";

  try {
    await fs_p.mkdir(folderPath, { recursive: true });
    await fs_p.writeFile(indexYamlPath, structure, "utf8");
    console.log("index.yaml created successfully!");
  } catch (err) {
    console.error("Error creating index.yaml:", err);
  }
}

// (async () => {
//   try {
//     const relativeFolderPath = "../../ONDC-NTS-Specifications/api/cp0";
//     const structure = await getFileStructureRelative(relativeFolderPath);
//     console.log("File structure:", structure);
//   } catch (err) {
//     console.error("Error testing getFileStructureRelative:", err);
//   }
// })();

module.exports = { createIndexYaml };
