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
    const compFiles = await fs_p.readdir(comp.folderPath, {
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
      let subYamlData: ExampleDomainIndexYml = {};
      if (fs.existsSync(subIndexPath)) {
        subYamlData = yaml.load(
          await readYamlFile(subIndexPath)
        ) as ExampleDomainIndexYml;
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
        const exampleFileName = subFile.name;
        if (!subFile.isDirectory()) continue;
        if (subFile.name === "forms") continue;

        if (subYamlData.hasOwnProperty(subFile.name)) {
          const data = subYamlData[subFile.name];
          for (const example of data.examples) {
            await addedExample.add({
              name: subFile.name,
              ID: "JSON",
              examples: {
                [subFile.name]: [
                  {
                    ID: "JSON",
                    name: subFile.name,
                    exampleName: example.value.$ref
                      .split("/")
                      .pop()
                      .split(".")[0],
                    summary: example.summary,
                    description: example.description,
                    exampleValue: await yaml.load(
                      await readYamlFile(
                        path.resolve(
                          addedExample.folderPath,
                          example.value.$ref
                        )
                      )
                    ),
                  },
                ],
              },
            });
          }
        }
      }
    }
  }
  private static async loadExamplesFormatted(
    file: fs.Dirent,
    comp: ComponentsType
  ) {}
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
