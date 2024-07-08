import fs from "fs";
import path from "path";
let obj_list = [];

interface ExtractedPath {
  path: string;
  required: boolean;
  type: string;
  Owner: string;
  usage: any;
}

export function ExtractAttributesFromExample(
  data: any,
  parentKey = "",
  objList: ExtractedPath[] = []
): ExtractedPath[] {
  if (typeof data === "object" && data !== null) {
    for (const key in data) {
      const currentKey = parentKey ? `${parentKey}.${key}` : key;
      const value = data[key];

      if (typeof value === "object" && value !== null) {
        ExtractAttributesFromExample(value, currentKey, objList);
      } else {
        const obj: ExtractedPath = {
          path: removeNumbersFromString(currentKey),
          required: false,
          type: "string",
          Owner: "any",
          usage: value,
        };
        if (obj.path.split(".").includes("tags")) {
          continue;
        }
        objList.push(obj);
      }
    }
  }
  return objList;
}

function removeNumbersFromString(str: string): string {
  // Regex to match number between dots
  const regex = /\.(\d+)\b/g;

  // Replace numbers with empty string
  const result = str.replace(regex, "");

  // Remove trailing dot if any
  return result.replace(/\.$/, "");
}

(async () => {
  //   const output = {};
  //   const files = fs.readdirSync(path.resolve(__dirname, "../../../history"), {
  //     withFileTypes: true,
  //   });
  //   for (const file of files) {
  //     if (file.isFile()) {
  //       const data = JSON.parse(
  //         fs.readFileSync(
  //           path.resolve(__dirname, "../../../history/" + file.name),
  //           "utf-8"
  //         )
  //       );
  //       obj_list = [];
  //       extractPaths(data);
  //       output[file.name] = obj_list;
  //     }
  //   }
  //   console.log(output);
  //   fs.writeFileSync("output.json", JSON.stringify(output, null, 2));
  //   const data = JSON.parse(
  //     fs.readFileSync(
  //       path.resolve(__dirname, "../../../history/on_report.json"),
  //       "utf-8"
  //     )
  //   );
  //   obj_list = [];
  //   extractPaths(data);
  //   console.log(obj_list);
})();
