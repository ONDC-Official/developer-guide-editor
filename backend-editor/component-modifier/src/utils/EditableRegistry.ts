import { FolderTypes } from "./ComponentType/constants";
import { Editable } from "./Editable";

type exampleYaml = Record<
  string,
  { summary: string; description: string; example_set: { $ref: string } }
>;
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
    const object = new cls(path, name) as Editable;
    let removeContent = this.getRemoveContent(type);
    await object.initIndexYaml(path, removeContent);
    return object;
  }

  static getRemoveContent(type: string) {
    if (type.includes("Folder")) {
      if ([FolderTypes.COMPONENTS, FolderTypes.TLC_FOLDER].includes(type))
        return false;
      else return true;
    }
    return false;
  }
}

// (async () => {
//   initRegistry();
//   await EditableRegistry.loadComponent(
//     "../../../FORKED_REPO/api/components",
//     "components"
//   );
// })();

// renameFolder(
//   path.resolve(
//     __dirname,
//     "../../../ONDC-NTS-Specifications/api/components/examples/personal-loan"
//   ),
//   "personal-loans"
// );
