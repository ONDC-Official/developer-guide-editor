import fs from "fs";
import yaml from "js-yaml";
import path from "path";
import { readYamlFile } from "../../fileUtils";
import { AttributeRow, AttributeType } from "./AttributeRow";

export function getSheets(yamlData: any) {
  const obj: any = yaml.load(yamlData);
  return getSheetsObj(obj);
}

export function getSheetsObj(obj: any) {
  let sheets: AttributeType = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const element = obj[key];
      const list = listDetailedPaths(yaml.dump(element));
      sheets[key] = list;
    }
  }
  return sheets;
}

export function addRows(data, sheetName: string, rows: AttributeRow[]) {
  const sheet = data[sheetName] ?? [];
  for (const row of rows) {
    const ob = {
      path: row.path,
      required: row.required ?? "Optional",
      type: row.type ?? "String",
      owner: row.owner ?? "BAP",
      usage: row.usage ?? "General",
      description: row.description,
    };
    sheet.push(ob);
  }
  return data;
}

/**
 * Removes rows from a specified sheet based on matching attributes.
 *
 * @param data The entire workbook data as an object where each key is a sheet name.
 * @param sheetName The name of the sheet to modify.
 * @param rows The rows to be removed, each containing attributes to match against.
 * @returns Updated workbook data with the rows removed from the specified sheet.
 */
export function deleteRows(
  data: Record<string, AttributeRow[]>,
  sheetName: string,
  rows: AttributeRow[]
): Record<string, any[]> {
  // Extract the rows to remove from the input
  const rowsToRemove = rows;
  // Access the data of the specific sheet
  const originalSheetData = data[sheetName];
  // Filter out rows that match any of the paths in rowsToRemove
  const filteredSheetData = originalSheetData.filter(
    (sheetRow) =>
      !rowsToRemove.some((rowToRemove) => sheetRow.path === rowToRemove.path)
  );
  // Update the original data structure with the filtered data
  data[sheetName] = filteredSheetData;
  return data;
}

export function updateRows(
  data: Record<string, AttributeRow[]>,
  sheetName: string,
  oldRows: AttributeRow[],
  newRows: AttributeRow[]
) {
  // Check if the specified sheet exists in the data.
  if (!data[sheetName]) {
    console.error(`Sheet name "${sheetName}" does not exist.`);
    return;
  }

  // Create a map of new rows keyed by 'path' for quick lookup.
  const newRowMap = new Map<string, AttributeRow>();
  for (const newRow of newRows) {
    newRowMap.set(newRow.path, newRow);
  }

  // Prepare a set of paths from oldRows for quick lookup.
  const oldRowPaths = new Set(oldRows.map((row) => row.path));

  // Update rows in the specified sheet.
  const updatedRows = data[sheetName].map((existingRow) => {
    if (oldRowPaths.has(existingRow.path)) {
      // Replace with the new row if it exists in the map; otherwise, keep the existing row.
      return newRowMap.get(existingRow.path) || existingRow;
    }
    return existingRow; // Return existing rows that are not in oldRows.
  });

  // Filter out new rows that are actually new (not just updates).
  const additionalNewRows = newRows.filter(
    (row) =>
      !data[sheetName].some((existingRow) => existingRow.path === row.path)
  );

  // Concatenate the additional new rows to the updated rows array.
  data[sheetName] = updatedRows.concat(additionalNewRows);

  console.log(`Rows updated successfully in sheet "${sheetName}".`);
}

export function sheetsToYAML(sheets) {
  let obj = {};
  // console.log(sheets);
  for (const key in sheets) {
    const element = sheets[key];
    obj[key] = convertDetailedPathsToNestedObjects(element);
  }
  // console.log("test ", obj);
  return yaml.dump(obj);
}

function listDetailedPaths(yamlString) {
  // console.log(yamlString);
  try {
    // Parse the YAML string into a JavaScript object
    const obj = yaml.load(yamlString);

    // Initialize an empty array to store the detailed paths
    let detailedPaths = [];

    // Recursive function to explore each key and sub-key

    // Start the recursive exploration
    detailedPaths = exploreObject(obj, "", detailedPaths);

    // Return the array of detailed paths
    return detailedPaths;
  } catch (e) {
    console.error("Error parsing YAML or iterating keys:", e);
    return [];
  }
}
function exploreObject(subObj, currentPath, detailedPaths) {
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
          ["required", "type", "owner", "usage"].every((prop) =>
            subObj[key].hasOwnProperty(prop)
          )
        ) {
          let req = null;
          try {
            req = subObj[key].required.toUpperCase();
          } catch {
            console.log("Error in required field");
          }
          // Store the detailed information about the path and properties
          detailedPaths.push({
            path: newPath,
            required: req ? req : subObj[key].required,
            type: subObj[key].type,
            owner: subObj[key].owner,
            usage: subObj[key].usage,
            description: subObj[key].description ?? "TBD",
          });
        }
        // Recurse into the sub-object
        detailedPaths = exploreObject(subObj[key], newPath, detailedPaths);
      }
    }
  }
  return detailedPaths;
}
function convertDetailedPathsToNestedObjects(detailedPaths) {
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
  return reconstructedObj;
}

// (async () => {
//   const d = await readYamlFile(
//     path.resolve(
//       __dirname,
//       "../../../../ONDC-NTS-Specifications/api/cp0/ATTRIBUTES/CREDIT/index.yaml"
//     )
//   );
//   // console.log(d);
//   const li = listDetailedPaths(d);
//   // console.log(li);
//   // const data = convertDetailedPathsToYAML(li);
//   const data = sheetsToYAML({ credit: li });
//   console.log(data);
//   // console.log();
// })();
