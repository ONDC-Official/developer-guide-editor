const fs = require("fs");
const yaml = require("js-yaml");
const path = require("path");

function getSheets(yamlData) {
  let sheets = {};
  const obj = yaml.load(yamlData);
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const element = obj[key];
      sheets[key] = listDetailedPaths(element);
    }
  }
  return sheets;
}

function sheetsToYAML(sheets) {
  let obj = {};
  for (const key in sheets) {
    if (sheets.hasOwnProperty(key)) {
      const element = sheets[key];
      obj[key] = convertDetailedPathsToYAML(element);
    }
  }
  return yaml.dump(obj);
}

function listDetailedPaths(yamlString) {
  try {
    // Parse the YAML string into a JavaScript object
    const obj = yaml.load(yamlString);

    // Initialize an empty array to store the detailed paths
    let detailedPaths = [];

    // Recursive function to explore each key and sub-key
    function exploreObject(subObj, currentPath) {
      for (const key in subObj) {
        // Check if it's an own property and not inherited
        if (subObj.hasOwnProperty(key)) {
          // Construct the new path
          const newPath = currentPath ? `${currentPath}.${key}` : key;

          // If the value is an object and not null or an array, check for properties
          if (
            typeof subObj[key] === "object" &&
            subObj[key] !== null &&
            !Array.isArray(subObj[key])
          ) {
            // Check if the object at this path has the specific properties
            if (
              ["required", "type", "owner", "usage", "description"].every(
                (prop) => subObj[key].hasOwnProperty(prop)
              )
            ) {
              // Store the detailed information about the path and properties
              detailedPaths.push({
                path: newPath,
                required: subObj[key].required,
                type: subObj[key].type,
                owner: subObj[key].owner,
                usage: subObj[key].usage,
                description: subObj[key].description,
              });
            }

            // Recurse into the sub-object
            exploreObject(subObj[key], newPath);
          }
        }
      }
    }

    // Start the recursive exploration
    exploreObject(obj, "");

    // Return the array of detailed paths
    return detailedPaths;
  } catch (e) {
    console.error("Error parsing YAML or iterating keys:", e);
    return [];
  }
}

console.log();

function convertDetailedPathsToYAML(detailedPaths) {
  // Function to safely access nested properties
  function setPath(obj, path, value) {
    const keys = path.split(".");
    const lastKey = keys.pop();
    const lastObj = keys.reduce((obj, key) => (obj[key] = obj[key] || {}), obj);
    lastObj[lastKey] = value;
  }

  // Create an empty object to hold the reconstructed structure
  const reconstructedObj = {};

  // Loop through each detailed path object and reconstruct the hierarchy
  detailedPaths.forEach((item) => {
    setPath(reconstructedObj, item.path, {
      required: item.required,
      type: item.type,
      owner: item.owner,
      usage: item.usage,
      description: item.description,
    });
  });

  // Convert the reconstructed object to YAML
  return yaml.dump(reconstructedObj);
}

// console.log(listDetailedPaths(f))

module.exports = { getSheets, sheetsToYAML };
