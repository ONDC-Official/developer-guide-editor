import { AttributeFile } from "./AttributeRow";
import { folderTypeEditable, UpdateObj } from "../../folderTypeEditable";
import { updateYamlRefAttr } from "../../yamlUtils";

export class AttributesFolderTypeEditable extends folderTypeEditable {
  getRegisterID(): string {
    return AttributesFolderTypeEditable.REGISTER_ID;
  }

  static REGISTER_ID = "ATTRIBUTE_FOLDER";

  constructor(path, id) {
    console.log(path);
    super(path, id);
    this.allowedList = [AttributeFile.REGISTER_ID];
  }

  async add(new_editable) {
    if (!this.allowedList.includes(new_editable.ID)) {
      console.log(new_editable);
      throw new Error(
        `Attributes only allow ${AttributeFile.REGISTER_ID} as children.`
      );
    }
    await super.add(new_editable);
    const addedChild = this.chilrenEditables.find(
      (s) => s.name === new_editable.name
    );
    await updateYamlRefAttr(this.yamlPathLong, addedChild.name);
  }

  async getData() {
    if (this.chilrenEditables.length === 0) return [];
    console.log(this.chilrenEditables);
    return this.chilrenEditables.map((editable) => editable.name);
  }

  async remove(deleteTarget) {
    await super.remove(deleteTarget);
    await updateYamlRefAttr(this.yamlPathLong, deleteTarget.name, true);
  }

  async update(update: UpdateObj) {
    await super.update(update);
    await updateYamlRefAttr(this.yamlPathLong, update.oldName, true);
    await updateYamlRefAttr(this.yamlPathLong, update.newName);
  }
}
