import fs_p from "fs/promises";
import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import { ComponentsType } from "./ComponentType/ComponentsFolderTypeEditable";
import { overrideYaml } from "./yamlUtils";
import { loadYamlWithRefs, readYamlFile } from "./fileUtils";
import {
  ExampleDomainIndexYml,
  ExampleFolderType,
} from "./ComponentType/examplesType/exampleFolderType";
import { ExampleDomainFolderType } from "./ComponentType/examplesType/ExampleDomainFolderType";
import { Editable } from "./Editable";

export class EditableRegistry {
  static registry = {};

  static register(cls: any) {
    this.registry[cls.REGISTER_ID] = cls;
  }

  static async create(type, path: string, name: string) {
    const cls = this.registry[type];
    if (!cls) {
      throw new Error(`No registered class with ID ${type}`);
    }
    const object = new cls(path, name);
    let removeContent = false;
    if (object.getRegisterID().includes("FOLDER")) {
      removeContent = true;
    }
    await object.initIndexYaml(path, removeContent);
    return object;
  }
  static async loadComponent(componentPath: string, name: string) {
    const comp: ComponentsType = await EditableRegistry.create(
      "COMPONENTS-FOLDER",
      componentPath,
      name
    );

    console.log("Loading Component:", comp.folderPath);
    let compFiles = await fs_p.readdir(comp.folderPath, {
      withFileTypes: true,
    });

    for (const file of compFiles) {
      if (!file.isDirectory()) continue;
      if (file.name === "enum") {
        await fs.renameSync(
          `${comp.folderPath}/enum`,
          `${comp.folderPath}/enums`
        );
      }
    }
    compFiles = await fs_p.readdir(comp.folderPath, {
      withFileTypes: true,
    });
    for (const file of compFiles) {
      if (!file.isDirectory()) continue;

      await EditableRegistry.loadAttributes(file, comp);
      await EditableRegistry.loadEnums(file, comp);
      await EditableRegistry.loadTags(file, comp);
      await EditableRegistry.loadExamples(file, comp);
    }
    return comp;
  }

  private static async loadTags(file: fs.Dirent, comp: ComponentsType) {
    if (file.name === "tags") {
      const defExists = fs.existsSync(`${comp.folderPath}/tags/default`);
      const ymlPath = `${comp.folderPath}/tags/index.yaml`;
      const indexExists = fs.existsSync(ymlPath);
      let data: any = "";
      console.log(`Yml exists: ${indexExists} def exists: ${defExists}`);
      if (indexExists) {
        data = await loadYamlWithRefs(ymlPath);
      }
      await comp.add({ ID: "TAG_FOLDER" });
      const tagFolder = comp.getTarget("TAG_FOLDER", "tags", comp);
      const tagFiles = await fs_p.readdir(tagFolder.folderPath, {
        withFileTypes: true,
      });
      if (!defExists) {
        if (data !== "") {
          await overrideYaml(
            tagFolder.folderPath + "/default/index.yaml",
            yaml.dump(data)
          );
        }
      }
      for (const tagFile of tagFiles) {
        if (tagFile.isDirectory() && tagFile.name !== "default") {
          await tagFolder.add({
            ID: "TAG_FILE",
            name: tagFile.name,
          });
        }
      }
    }
  }

  private static async loadEnums(file: fs.Dirent, comp: ComponentsType) {
    if (file.name === "enums") {
      const defExists = fs.existsSync(`${comp.folderPath}/enums/default`);
      const ymlPath = `${comp.folderPath}/enums/index.yaml`;
      const indexExists = fs.existsSync(ymlPath);
      let data: any = "";
      console.log(`Yml exists: ${indexExists} def exists: ${defExists}`);
      if (indexExists) {
        data = await loadYamlWithRefs(ymlPath);
      }
      await comp.add({ ID: "ENUM_FOLDER" });
      const enumFolder = comp.getTarget("ENUM_FOLDER", "enums", comp);
      const enumFiles = await fs_p.readdir(enumFolder.folderPath, {
        withFileTypes: true,
      });
      if (!defExists) {
        if (data !== "") {
          await overrideYaml(
            enumFolder.folderPath + "/default/index.yaml",
            yaml.dump(data)
          );
        }
      }
      for (const enumFile of enumFiles) {
        if (enumFile.isDirectory() && enumFile.name !== "default") {
          await enumFolder.add({
            ID: "ENUM_FILE",
            name: enumFile.name,
          });
        }
      }
    }
  }

  private static async loadAttributes(file: fs.Dirent, comp: ComponentsType) {
    if (file.name === "attributes") {
      await comp.add({
        ID: "ATTRIBUTE_FOLDER",
      });
      const attr = comp.getTarget("ATTRIBUTE_FOLDER", "attributes", comp);
      const attrFiles = await fs_p.readdir(attr.folderPath, {
        withFileTypes: true,
      });
      for (const attrFile of attrFiles) {
        if (attrFile.isDirectory()) {
          await attr.add({
            ID: "ATTRIBUTE_FILE",
            name: attrFile.name,
          });
        }
      }
    }
  }

  private static async loadExamples(file: fs.Dirent, comp: ComponentsType) {
    if (file.name !== "examples") return;
    let indexData = {};
    const indexPath = `${comp.folderPath}/examples/index.yaml`;
    if (fs.existsSync(indexPath)) {
      indexData = yaml.load(await readYamlFile(indexPath));
      indexData = indexData || {};
    }
    await comp.add({ ID: "EXAMPLE_FOLDER" });
    const exampleFolder = comp.getTarget(
      "EXAMPLE_FOLDER",
      "examples",
      comp
    ) as ExampleFolderType;
    const exampleFiles = await fs_p.readdir(exampleFolder.folderPath, {
      withFileTypes: true,
    });

    for (const file of exampleFiles) {
      if (!file.isDirectory()) continue;
      const exampleDomainName = file.name;
      const subIndexPath = `${exampleFolder.folderPath}/${exampleDomainName}/index.yaml`;
      let secondaryPath = `${exampleFolder.folderPath}/${exampleDomainName}/${exampleDomainName}.yaml`;
      console.log("index data");
      if (
        indexData[exampleDomainName] &&
        indexData[exampleDomainName].example_set.$ref
      ) {
        console.log(
          "secondary path",
          indexData[exampleDomainName].example_set.$ref
        );
        secondaryPath = path.resolve(
          file.path,
          indexData[exampleDomainName].example_set.$ref
        );
      }
      let subYamlData: ExampleDomainIndexYml = {};
      if (fs.existsSync(subIndexPath)) {
        subYamlData = (await loadYamlWithRefs(
          subIndexPath
        )) as ExampleDomainIndexYml;

        subYamlData = subYamlData || {};
      } else if (fs.existsSync(secondaryPath)) {
        subYamlData = (await loadYamlWithRefs(
          secondaryPath
        )) as ExampleDomainIndexYml;

        subYamlData = subYamlData || {};
      }

      await exampleFolder.add({
        ID: "EXAMPLE_DOMAIN_FOLDER",
        name: exampleDomainName,
        description: indexData[exampleDomainName]?.description || "TBD",
        summary: indexData[exampleDomainName]?.summary || exampleDomainName,
      });

      const addedExample = exampleFolder.getTarget(
        "EXAMPLE_DOMAIN_FOLDER",
        exampleDomainName,
        exampleFolder
      ) as ExampleDomainFolderType;

      const subFiles = await fs_p.readdir(addedExample.folderPath, {
        withFileTypes: true,
      });
      console.log("sub data", subYamlData);
      for (const subFile of subFiles) {
        if (!subFile.isDirectory()) continue;
        // if (subFile.name === "forms") {
        //   console.log(subFile.name, "inside");
        //   const forms = await fs_p.readdir(subFile.path, {
        //     withFileTypes: true,
        //   });
        //   // console.log(forms);
        //   for (const f of forms) {
        //     const html = await fs_p.readFile(f.path);
        //     await addedExample.add({
        //       name: subFile.name,
        //       ID: "FORM",
        //       examples: {
        //         [subFile.name]: [
        //           {
        //             name: subFile.name,
        //             ID: "FORM",
        //             exampleName: " ",
        //             summary: f.name,
        //             description: " ",
        //             exampleValue: html,
        //           },
        //         ],
        //       },
        //     });
        //   }
        // }

        if (subYamlData.hasOwnProperty(subFile.name)) {
          const data = subYamlData[subFile.name];
          ForceUniqueSummary(data);
          for (const example of data.examples) {
            await addedExample.add({
              name: subFile.name,
              ID: "JSON",
              examples: {
                [subFile.name]: [
                  {
                    ID: "JSON",
                    name: subFile.name,
                    exampleName: " ",
                    summary: example.summary,
                    description: example.description,
                    exampleValue: example.value,
                  },
                ],
              },
            });
          }
        }
      }
    }
  }
}

function ForceUniqueSummary(data: {
  examples: { summary: string; description: string; value: { $ref: string } }[];
}) {
  const summaryCounts = data.examples
    .map((s) => s.summary.trim())
    .reduce((acc, summary) => {
      acc[summary] = (acc[summary] || 0) + 1;
      return acc;
    }, {});
  // Step 2: Create a map to track the number of times each summary has been encountered
  const summaryTracker = {};

  // Step 3: Modify summaries that occur more than once
  data.examples.forEach((example) => {
    const summary = example.summary;
    if (summaryCounts[summary] > 1) {
      if (!summaryTracker[summary]) {
        summaryTracker[summary] = 0;
      }
      summaryTracker[summary]++;
      example.summary = `${summary}-${summaryTracker[summary]}`;
    }
  });
}
// (async () => {
//   initRegistry();
//   console.log(
//     await EditableRegistry.loadComponent(
//       "../../../ONDC-NTS-Specifications/api/cpo",
//       "cp0"
//     )
//   );
// })();
