import path from "path";
import { loadYamlWithRefs } from "../../fileUtils";
import { convertToYamlWithRefs } from "../../extraUtils/yamlRefConvert";
import yaml from "js-yaml";

export interface SingleFlow {
  code: string;
  description: string;
  reference: string;
}

export interface FlowInfo {
  code: string;
  description: string;
  reference: string;
  required: string;
  list: FlowInfo[];
}
export interface FlowObject {
  path: string;
  Flow: FlowInfo[];
}

export type RecordOfFlowArrays = Record<string, FlowObject[]>;

export function mergeFlowObjectRecords(
  record1: RecordOfFlowArrays,
  record2: RecordOfFlowArrays
): RecordOfFlowArrays {
  const mergedRecord: RecordOfFlowArrays = {};

  const addItems = (key: string, items: FlowObject[]) => {
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

export function flowFromApi(yamlData: string) {
  const obj: any = yaml.load(yamlData);

  // let data = {};
  // for (const key in obj) {
  //   data[key] = listDetailedPaths(obj[key]);
  // }
  // return data;
  return obj;
}

export function flowToNested(data: Record<string, FlowObject[]>) {
  let nestedData = {};
  for (const key in data) {
    nestedData[key] = convertDetailedPathsToNestedObjects(data[key]);
  }
  return nestedData;
}

// function listDetailedPaths(obj: Record<string, any>) {
//   let detailedPaths = [];
//   detailedPaths = explorePaths(obj, "", detailedPaths);
//   return detailedPaths;
// }

// function explorePaths(
//   subObj: Record<string, any>,
//   currentPath: string,
//   detailedPaths: FlowObject[]
// ) {
//   for (const key in subObj) {
//     const newPath = currentPath ? `${currentPath}.${key}` : key;
//     if (
//       typeof subObj[key] === "object" &&
//       subObj[key] !== null &&
//       !Array.isArray(subObj[key])
//     ) {
//       detailedPaths = explorePaths(subObj[key], newPath, detailedPaths);
//     }
//     if (Array.isArray(subObj[key])) {
//       const flow: FlowInfo[] = subObj[key].map((element: any) => {
//         return {
//           code: element.code,
//           description: element.description,
//           reference: element.reference,
//           required: element.required,
//           list: element.list,
//         };
//       });
//       detailedPaths.push({ path: newPath, Flow: flow });
//     }
//   }

//   return detailedPaths;
// }

function convertDetailedPathsToNestedObjects(detailedPaths: FlowObject[]) {
  function setPath(obj, path, value) {
    const keys = path.split(".");
    const lastKey = keys.pop();
    const lastObj = keys.reduce((obj, key) => (obj[key] = obj[key] || {}), obj);
    lastObj[lastKey] = value;
  }

  const nestedObject = {};
  detailedPaths.forEach((element) => {
    setPath(nestedObject, element.path, element.Flow);
  });
  return nestedObject;
}

// (async () => {
//   const filePath = path.resolve(
//     __dirname,
//     "../../../../../ONDC-NTS-Specifications/flow/index.yaml"
//   );
//   const data = await loadYamlWithRefs(filePath);
//   //   console.log(JSON.stringify(data, null, 2));
//   const det = listDetailedPaths(data);
//   const nested = convertDetailedPathsToNestedObjects(det);
//   console.log(JSON.stringify(det, null, 2));
//   console.log(convertToYamlWithRefs(nested));
// })();
