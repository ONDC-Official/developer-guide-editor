import fs from "fs";
import path from "path";
let obj_list = [];
function extractPaths(data: any, parentKey = ""): void {
  if (typeof data === "object" && data !== null) {
    for (const key in data) {
      const currentKey = parentKey ? `${parentKey}.${key}` : key;
      const value = data[key];

      if (typeof value === "object" && value !== null) {
        extractPaths(value, currentKey);
      } else {
        const obj = {
          path: removeNumbersFromString(currentKey),
          required: false,
          type: "string",
          Owner: "any",
          usage: value,
        };
        obj_list.push(obj);
      }
    }
  }
}

function removeNumbersFromString(str: string): string {
  return str.replace(/\d+\./g, "");
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
