import { error } from "console";
import { copyDir } from "../fileUtils";
import { folderTypeEditable } from "../folderTypeEditable";
import { updateYamlRefComponents } from "../yamlUtils";
import { AttributesFolderTypeEditable } from "./AttributeType/AttributesFolderTypeEditable";

export class ComponentsType extends folderTypeEditable {
  getRegisterID(): string {
    return ComponentsType.REGISTER_ID;
  }
  static REGISTER_ID = "COMPONENTS-FOLDER";
  constructor(path, id) {
    super(path, id);
    this.allowedList = [AttributesFolderTypeEditable.REGISTER_ID];
  }
  async add(new_editable: { ID: string }) {
    if (!this.allowedList.includes(new_editable.ID)) {
      throw new Error("GIVEN TYPE IS NOT ALLOWED IN " + this.getRegisterID());
    }
    const completeData = {
      ID: new_editable.ID,
      name: this.GetForcedName(new_editable.ID),
    };
    await super.add(completeData);
    const addedChild = this.chilrenEditables.find(
      (s) => s.name === completeData.name
    );
    await updateYamlRefComponents(this.yamlPathLong, addedChild.name);
  }
  async getData() {
    if (this.chilrenEditables.length === 0) return [];
    const data = this.chilrenEditables.map((editable) => {
      return {
        name: editable.name,
        registerID: editable.getRegisterID(),
        path: `${this.name}/${editable.name}`,
      };
    });
    console.log(data);
    return data;
  }
  async remove(deleteTarget) {
    await super.remove(deleteTarget);
    await updateYamlRefComponents(this.yamlPathLong, deleteTarget.name, true);
  }
  async saveData(path) {
    await copyDir(this.longPath, path);
  }
  async loadData() {}

  GetForcedName(ID: string): string {
    if (ID === AttributesFolderTypeEditable.REGISTER_ID) {
      return "attributes";
    }
    return "UNKNOWN";
  }
}

module.exports = { ComponentsType };
