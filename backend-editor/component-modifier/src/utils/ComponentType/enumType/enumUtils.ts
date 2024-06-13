import yaml from "js-yaml";
import { readYamlFile } from "../../fileUtils";
import path from "path";
import { convertToYamlWithRefs } from "../../extraUtils/yamlRefConvert";

export interface enumInfo {
  code: string;
  description: string;
  reference: "<PR/Issue/Discussion Links md format text";
}

export interface enumObject {
  path: string;
  enums: enumInfo[];
}

export type RecordOfEnumArrays = Record<string, enumObject[]>;

// Function to merge two Record<string, enumObject[]> objects
export function mergeEnumObjectRecords(
  record1: RecordOfEnumArrays,
  record2: RecordOfEnumArrays
): RecordOfEnumArrays {
  // Create a new record that will store the merged results
  const mergedRecord: RecordOfEnumArrays = {};

  // Helper function to add items to the mergedRecord
  const addItems = (key: string, items: enumObject[]) => {
    if (mergedRecord[key]) {
      mergedRecord[key] = [...mergedRecord[key], ...items];
    } else {
      mergedRecord[key] = [...items];
    }
  };

  // Process each record and merge them
  Object.keys(record1).forEach((key) => addItems(key, record1[key]));
  Object.keys(record2).forEach((key) => addItems(key, record2[key]));

  return mergedRecord;
}

export function enumsFromApi(yamlData: string) {
  const obj: any = yaml.load(yamlData);
  let data = {};
  for (const key in obj) {
    data[key] = listDetailedPaths(obj[key]);
  }
  return data;
}

export function enumsToNestes(data: Record<string, enumObject[]>) {
  let nestedData = {};
  for (const key in data) {
    nestedData[key] = convertDetailedPathsToNestedObjects(data[key]);
  }
  return nestedData;
}

const listDetailedPaths = (obj: Record<string, any>) => {
  // const obj: Record<string, any> = yaml.load(yamlData);
  let detailedPaths = [];
  detailedPaths = explorePaths(obj, "", detailedPaths);
  return detailedPaths;
};

function explorePaths(
  subObj: Record<string, any>,
  currentPath: string,
  detailedPaths: enumObject[]
) {
  for (const key in subObj) {
    const newPath = currentPath ? `${currentPath}.${key}` : key;
    if (
      typeof subObj[key] === "object" &&
      subObj[key] !== null &&
      !Array.isArray(subObj[key])
    ) {
      detailedPaths = explorePaths(subObj[key], newPath, detailedPaths);
    }
    if (Array.isArray(subObj[key])) {
      const enums: enumInfo[] = subObj[key].map((element: any) => {
        return {
          code: element.code,
          description: element.description,
          reference: element.reference,
        };
      });
      detailedPaths.push({ path: newPath, enums: enums });
    }
  }
  return detailedPaths;
}
function convertDetailedPathsToNestedObjects(detailedPaths: enumObject[]) {
  function setPath(obj, path, value) {
    const keys = path.split(".");
    const lastKey = keys.pop();
    const lastObj = keys.reduce((obj, key) => (obj[key] = obj[key] || {}), obj);
    lastObj[lastKey] = value;
  }
  const nestedObject = {};
  detailedPaths.forEach((element) => {
    setPath(nestedObject, element.path, element.enums);
  });
  return nestedObject;
}

// (async () => {
//   const filePath = path.join(__dirname, "../../../../test/test.yaml");
//   const data = await readYamlFile(filePath);
//   // const yml = yaml.load(data);
//   const det = listDetailedPaths(data);
//   const nested = convertDetailedPathsToNestedObjects(det);
//   console.log(JSON.stringify(det, null, 2));
//   // console.log(convertToYamlWithRefs(nested));
// })();
