const fs = require("fs");
const yaml = require("js-yaml");
const path = require("path");
/**
 * Adds or updates a section with a $ref in a YAML file.
 * @param {string} filePath - Path to the YAML file.
 * @param {string} section - Section to add or update in the file (e.g., 'examples').
 * @param {string} refPath - Path to reference in the $ref.
 */
async function updateYamlRef(filePath, section, refPath) {
  // Read the existing YAML file
  const folderPath = path.join(__dirname, filePath);
  console.log("Resolved folder path:", folderPath);
  const fileContents = await fs.promises.readFile(folderPath, "utf8");

  // Parse the YAML file into a JavaScript object
  const data = yaml.load(fileContents) || {};

  // Add or update the section with the new $ref
  data[section] = { $ref: refPath };

  // Convert the JavaScript object back to a YAML string
  const newYaml = yaml.dump(data);

  // Write the updated YAML back to the file
  await fs.promises.writeFile(folderPath, newYaml, "utf8");

  console.log(`${section} has been updated with new $ref successfully.`);
}

// updateYamlRef(
//   "../../ONDC-NTS-Specifications/api/cp0/index.yaml",
//   "examples",
//   "./examples/index.yaml"
// );

module.exports = { updateYamlRef };
