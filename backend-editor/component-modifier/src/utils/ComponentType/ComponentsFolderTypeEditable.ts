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
  async add(new_editable) {
    if (!this.allowedList.includes(new_editable.ID)) {
      throw new Error("GIVEN TYPE IS NOT ALLOWED IN " + this.getRegisterID());
    }
    await super.add(new_editable);
    const addedChild = this.chilrenEditables.find(
      (s) => s.name === new_editable.name
    );
    await updateYamlRefComponents(this.yamlPathLong, addedChild.name);
  }
  async getData() {
    if (this.chilrenEditables.length === 0) return [];
    const data = this.chilrenEditables.map((editable) => {
      return {
        name: editable.name,
        registerID: editable.getRegisterID(),
      };
    });
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
}

module.exports = { ComponentsType };
