import { copyDir } from "../fileUtils";
import { folderTypeEditable } from "../folderTypeEditable";
import { updateYamlRefComponents } from "../yamlUtils";
import { BuildCompenetsWithRawBuild } from "./componentsUtils";
import { FolderTypes } from "./constants";

export class ComponentsType extends folderTypeEditable {
  getRegisterID(): string {
    return ComponentsType.REGISTER_ID;
  }
  static REGISTER_ID = "COMPONENTS-FOLDER";
  constructor(path: string, id: string) {
    super(path, id);
    this.allowedList = [
      FolderTypes.ATTRIBUTE_FOLDER,
      FolderTypes.ENUM_FOLDER,
      FolderTypes.TAGS_FOLDER,
      FolderTypes.FLOW_FOLDER,
      FolderTypes.EXAMPLE_FOLDER,
      FolderTypes.TLC_FOLDER,
    ];
  }
  async add(new_editable: { ID: string; build?: any }) {
    if (new_editable.build) {
      await BuildCompenetsWithRawBuild(new_editable.build, this);
      return;
    }
    if (!new_editable.ID) throw new Error("ID is required");
    if (!this.allowedList.includes(new_editable.ID)) {
      throw new Error(
        `${new_editable.ID} TYPE IS NOT ALLOWED IN ` + this.getRegisterID()
      );
    }
    const completeData = {
      ID: new_editable.ID,
      name: this.GetForcedName(new_editable.ID),
    };
    await super.add(completeData);
    const addedChild = this.childrenEditables.find(
      (s) => s.name === completeData.name
    );
    await updateYamlRefComponents(this.yamlPathLong, addedChild.name);
  }
  async getData(query) {
    if (this.childrenEditables.length === 0) return [];
    const data = this.childrenEditables.map((editable) => {
      return {
        name: editable.name,
        registerID: editable.getRegisterID(),
        path: `${this.name}/${editable.name}`,
      };
    });
    console.log(data);
    return data;
  }
  async remove(deleteTarget: { folderName: string }) {
    await super.remove(deleteTarget);
    await updateYamlRefComponents(
      this.yamlPathLong,
      deleteTarget.folderName,
      true
    );
  }
  async saveData(path: string) {
    await copyDir(this.longPath, path);
  }
  async loadData() {}

  GetForcedName(ID: string): string {
    if (ID === FolderTypes.ATTRIBUTE_FOLDER) {
      return "attributes";
    }
    if (ID === FolderTypes.ENUM_FOLDER) {
      return "enum";
    }
    if (ID === FolderTypes.TAGS_FOLDER) {
      return "tags";
    }
    if (ID === FolderTypes.FLOW_FOLDER) {
      return "flows";
    }
    if (ID === FolderTypes.EXAMPLE_FOLDER) {
      return "examples";
    }
    if (ID === FolderTypes.TLC_FOLDER) {
      return "tlc";
    }
    return "UNKNOWN";
  }
  async update(Editable) {
    throw new Error(`${this.getRegisterID()} does not support Patch!`);
  }
}

module.exports = { ComponentsType };
