import fs_p from "fs/promises";
import fs from "fs";
import yaml from "js-yaml";
import { ComponentsType } from "./ComponentType/ComponentsFolderTypeEditable";
import { overrideYaml } from "./yamlUtils";
import { loadYamlWithRefs } from "./fileUtils";

export class EditableRegistry {
  static registry = {};

  static register(cls: any) {
    this.registry[cls.REGISTER_ID] = cls;
  }
  static async create(type, path, name) {
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
      if (file.isDirectory()) {
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
    }
    return comp;
  }
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
