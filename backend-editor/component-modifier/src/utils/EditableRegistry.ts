import fs_p from "fs/promises";
import { Editable } from "./Editable";

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
    const comp = await EditableRegistry.create(
      "COMPONENTS-FOLDER",
      Componentpath,
      name
    );
    console.log("Loading Component:", comp.folderPath);
    const files = await fs_p.readdir(comp.folderPath, { withFileTypes: true });
    for (const file of files) {
      console.log(file.name);
      if (file.isDirectory()) {
        if (file.name === "attributes") {
          comp.add({
            ID: "ATTRIBUTES_FOLDER",
            name: "attributes",
          });
          const attributes = await fs_p.readdir(file.path, {
            withFileTypes: true,
          });
          const attr = comp.getTarget("ATTRIBUTES_FOLDER", "attributes", comp);
          for (const attrFile of attributes) {
            if (attrFile.isFile()) {
              attr.add({
                ID: "ATTRIBUTE_FILE",
                name: attrFile.name,
              });
            }
          }
        }
      }
    }
    return comp;
  }
}
