const fs = require("fs");
const yaml = require("js-yaml");
const path = require("path");

async function updateYamlRefComponents(filePath, section) {
  await updateYamlRef(filePath, section, { $ref: `./${section}/index.yaml` });
}
async function updateYamlRefAttr(filePath, section) {
  await updateYamlRef(filePath, section, {
    attribute_set: { $ref: `./${section}/index.yaml` },
  });
}
async function updateYamlRef(filePath, section, updateLike) {
  try {
    const stats = await fs.promises.stat(filePath);
    if (!stats.isFile()) {
      throw new Error(`The specified path (${filePath}) is not a file.`);
    }
    const fileContents = await fs.promises.readFile(filePath, "utf8");
    const data = yaml.load(fileContents) ?? {};
    data[section] = updateLike;
    const newYaml = yaml.dump(data);
    await fs.promises.writeFile(filePath, newYaml, "utf8");
    console.log(`${section} has been updated with new $ref successfully.`);
  } catch (error) {
    console.error("Error updating the YAML file:", error);
  }
}

async function overrideYaml(filePath, data) {
  try {
    const stats = await fs.promises.stat(filePath);
    if (!stats.isFile()) {
      throw new Error(`The specified path (${filePath}) is not a file.`);
    }
    // const newYaml = yaml.dump(data);
    await fs.promises.writeFile(filePath, data, "utf8");
    console.log(`${filePath} has been updated successfully.`);
  } catch (error) {
    console.error("Error updating the YAML file:", error);
  }
}

// (async () => {
//   updateYamlRefComponents(
//     path.join(__dirname, "../../ONDC-NTS-Specifications/api/cp0/index.yaml"),
//     "new_section"
//   );
//   // updateYamlRefAttr('./index.yaml', 'new_section');
// })();

module.exports = { updateYamlRefComponents, updateYamlRefAttr, overrideYaml };
