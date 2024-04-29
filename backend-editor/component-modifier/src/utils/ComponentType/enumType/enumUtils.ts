import yaml from "js-yaml";
import { readYamlFile } from "../../fileUtils";
import path from "path";
import { convertToYamlWithRefs } from "../../Yaml Converter/yamlRefConvert";

// async function getApiEnums(filePath: string) {
//   const data = await readYamlFile(filePath);
//   const obj: Record<string, any> = yaml.load(data);
//   const
//   for (const key in obj) {
//     const element = obj[key];
//   }
//   return obj;
// }
export interface enumInfo {
  code: string;
  description: string;
  reference: "<PR/Issue/Discussion Links md format text";
}

export interface enumObject {
  path: string;
  enums: enumInfo[];
}

export const listDetailedPaths = (yamlData: string) => {
  const obj: Record<string, any> = yaml.load(yamlData);
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
export function convertDetailedPathsToNestedObjects(
  detailedPaths: enumObject[]
) {
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

(async () => {
  const filePath = path.join(__dirname, "../../../../test/test.yaml");
  const data = await readYamlFile(filePath);
  // const yml = yaml.load(data);
  const det = listDetailedPaths(data);
  // const nested = convertDetailedPathsToNestedObjects(det);
  console.log(JSON.stringify(det, null, 2));
  //   console.log(convertToYamlWithRefs(nested));
})();
