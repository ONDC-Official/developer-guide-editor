import fs_p from "fs/promises";

import { ComponentsType } from "./ComponentType/ComponentsFolderTypeEditable";
import { Dirent } from "fs";
import { initRegistry } from "./RegisterList";

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
  static async loadComponent(Componentpath, name) {
    const comp: ComponentsType = await EditableRegistry.create(
      "COMPONENTS-FOLDER",
      Componentpath,
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
          await comp.add({ ID: "ENUM_FILE" });
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
