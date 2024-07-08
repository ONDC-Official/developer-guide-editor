import { folderTypeEditable, UpdateObj } from "../../folderTypeEditable";
import { updateYamlRefTags } from "../../yamlUtils";
import { TagFileType } from "./tagFileType";

export class TagsFolderType extends folderTypeEditable {
  static REGISTER_ID = "TAG_FOLDER";

  constructor(path: string, name: string) {
    super(path, name);
    this.allowedList = [TagFileType.REGISTER_ID];
    // this.add({ ID: TagFileType.REGISTER_ID, name: "default" });
  }

  async add(newEditable: { ID: string; name: string }) {
    if (!this.allowedList.includes(newEditable.ID)) {
      throw new Error(`Tags only allow ${this.allowedList} as children.`);
    }
    await super.add(newEditable);
    const addedChild = this.childrenEditables.find(
      (s) => s.name === newEditable.name
    );
    await updateYamlRefTags(this.yamlPathLong, addedChild.name);
  }

  async getData(query: any) {
    return this.childrenEditables.map((editable) => editable.name);
  }

  async remove(deleteTarget: { folderName: string }) {
    if (deleteTarget.folderName === "default") {
      throw new Error("Cannot delete the default Tags");
    }
    await super.remove(deleteTarget);
    await updateYamlRefTags(this.yamlPathLong, deleteTarget.folderName, true);
  }
  async update(update: UpdateObj) {
    await super.update(update);
    await updateYamlRefTags(this.yamlPathLong, update.oldName, true);
    await updateYamlRefTags(this.yamlPathLong, update.newName);
  }
  getRegisterID(): string {
    return TagsFolderType.REGISTER_ID;
  }
}
