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

  async add(new_editable: { ID: string; name: string }) {
    if (!this.allowedList.includes(new_editable.ID)) {
      console.log(new_editable);
      throw new Error(
        `Attributes only allow ${AttributeFile.REGISTER_ID} as children.`
      );
    }
    await super.add(new_editable);
    const addedChild = this.childrenEditables.find(
      (s) => s.name === new_editable.name
    );
    await updateYamlRefAttr(this.yamlPathLong, addedChild.name);
  }

  async getData(query) {
    if (this.childrenEditables.length === 0) return [];
    if (query.type === "pathSet") {
      const data = new Set();
      for (const editable of this.childrenEditables) {
        const child_data = await editable.getData(query);
        for (const key in child_data) {
          child_data[key].forEach((element) => {
            data.add(element.path);
          });
        }
      }
      return Array.from(data);
    }
    return this.childrenEditables.map((editable) => editable.name);
  }

  async remove(deleteTarget: { folderName: string }) {
    await super.remove(deleteTarget);
    await updateYamlRefAttr(this.yamlPathLong, deleteTarget.folderName, true);
  }

  async update(update: UpdateObj) {
    await super.update(update);
    await updateYamlRefAttr(this.yamlPathLong, update.oldName, true);
    await updateYamlRefAttr(this.yamlPathLong, update.newName);
  }
}
