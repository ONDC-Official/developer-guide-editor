import { copyDir } from "../fileUtils";
import { folderTypeEditable } from "../folderTypeEditable";
import { updateYamlRefComponents } from "../yamlUtils";
import { AttributesFolderTypeEditable } from "./AttributeType/AttributesFolderTypeEditable";
import { EnumFolderType } from "./enumType/enumFolderType";
import { TagsFolderType } from "./tagType/tagsFolderType";
import { FlowFolderType } from "./flowType/flowFolderType";
import { ExampleFolderType } from "./examplesType/exampleFolderType";
import { BuildCompenetsWithRawBuild } from "./componentsUtils";

export class ComponentsType extends folderTypeEditable {
  getRegisterID(): string {
    return ComponentsType.REGISTER_ID;
  }
  static REGISTER_ID = "COMPONENTS-FOLDER";
  constructor(path, id) {
    super(path, id);
    this.allowedList = [
      AttributesFolderTypeEditable.REGISTER_ID,
      EnumFolderType.REGISTER_ID,
      TagsFolderType.REGISTER_ID,
      FlowFolderType.REGISTER_ID,
      ExampleFolderType.REGISTER_ID,
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
  async saveData(path) {
    await copyDir(this.longPath, path);
  }
  async loadData() {}

  GetForcedName(ID: string): string {
    if (ID === AttributesFolderTypeEditable.REGISTER_ID) {
      return "attributes";
    }
    if (ID === EnumFolderType.REGISTER_ID) {
      return "enum";
    }
    if (ID === TagsFolderType.REGISTER_ID) {
      return "tags";
    }
    if (ID === FlowFolderType.REGISTER_ID) {
      return "flows";
    }
    if (ID === ExampleFolderType.REGISTER_ID) {
      return "examples";
    }
    return "UNKNOWN";
  }
  async update(Editable) {
    throw new Error(`${this.getRegisterID()} does not support Patch!`);
  }
}

module.exports = { ComponentsType };
