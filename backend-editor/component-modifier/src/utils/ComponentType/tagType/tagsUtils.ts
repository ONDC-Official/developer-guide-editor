import path from "path";
import { loadYamlWithRefs } from "../../fileUtils";
import { convertToYamlWithRefs } from "../../Yaml Converter/yamlRefConvert";
import yaml from "js-yaml";

export interface SingleTag {
  code: string;
  description: string;
  reference: string;
}

export interface TagInfo {
  code: string;
  description: string;
  reference: string;
  required: string;
  list: TagInfo[];
}
export interface TagObject {
  path: string;
  tag: TagInfo[];
}

export type RecordOfTagArrays = Record<string, TagObject[]>;

export function mergeTagObjectRecords(
  record1: RecordOfTagArrays,
  record2: RecordOfTagArrays
): RecordOfTagArrays {
  const mergedRecord: RecordOfTagArrays = {};

  const addItems = (key: string, items: TagObject[]) => {
    if (mergedRecord[key]) {
      mergedRecord[key] = [...mergedRecord[key], ...items];
    } else {
      mergedRecord[key] = [...items];
    }
  };

  Object.keys(record1).forEach((key) => addItems(key, record1[key]));
  Object.keys(record2).forEach((key) => addItems(key, record2[key]));

  return mergedRecord;
}

export function tagsFromApi(yamlData: string) {
  const obj: any = yaml.load(yamlData);
  let data = {};
  for (const key in obj) {
    data[key] = listDetailedPaths(obj[key]);
  }
  return data;
}

export function tagsToNested(data: Record<string, TagObject[]>) {
  let nestedData = {};
  for (const key in data) {
    nestedData[key] = convertDetailedPathsToNestedObjects(data[key]);
  }
  return nestedData;
}

function listDetailedPaths(obj: Record<string, any>) {
  let detailedPaths = [];
  detailedPaths = explorePaths(obj, "", detailedPaths);
  return detailedPaths;
}

function explorePaths(
  subObj: Record<string, any>,
  currentPath: string,
  detailedPaths: TagObject[]
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
      const tags: TagInfo[] = subObj[key].map((element: any) => {
        return {
          code: element.code,
          description: element.description,
          reference: element.reference,
          required: element.required,
          list: element.list,
        };
      });
      detailedPaths.push({ path: newPath, tag: tags });
    }
  }
  return detailedPaths;
}

function convertDetailedPathsToNestedObjects(detailedPaths: TagObject[]) {
  function setPath(obj, path, value) {
    const keys = path.split(".");
    const lastKey = keys.pop();
    const lastObj = keys.reduce((obj, key) => (obj[key] = obj[key] || {}), obj);
    lastObj[lastKey] = value;
  }
  const nestedObject = {};
  detailedPaths.forEach((element) => {
    setPath(nestedObject, element.path, element.tag);
  });
  return nestedObject;
}

// (async () => {
//   const filePath = path.resolve(
//     __dirname,
//     "../../../../../ONDC-NTS-Specifications/tags/index.yaml"
//   );
//   const data = await loadYamlWithRefs(filePath);
//   //   console.log(JSON.stringify(data, null, 2));
//   const det = listDetailedPaths(data);
//   const nested = convertDetailedPathsToNestedObjects(det);
//   console.log(JSON.stringify(det, null, 2));
//   console.log(convertToYamlWithRefs(nested));
// })();
