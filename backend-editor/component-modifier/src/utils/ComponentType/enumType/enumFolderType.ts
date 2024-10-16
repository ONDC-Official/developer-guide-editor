import { folderTypeEditable, UpdateObj } from "../../folderTypeEditable";
import { updateYamlRefEnum } from "../../yamlUtils";
import { EnumFileType } from "./enumFileType";

export class EnumFolderType extends folderTypeEditable {
  static REGISTER_ID = "ENUM_FOLDER";

  constructor(path: string, name: string) {
    super(path, name);
    this.allowedList = [EnumFileType.REGISTER_ID];
    // this.add({ ID: EnumFileType.REGISTER_ID, name: "default" });
  }

  async add(newEditable: { ID: string; name: string }) {
    if (!this.allowedList.includes(newEditable.ID)) {
      throw new Error(
        `Enums only allow ${EnumFileType.REGISTER_ID} as children.`
      );
    }
    await super.add(newEditable);
    const addedChild = this.childrenEditables.find(
      (s) => s.name === newEditable.name
    );
    await updateYamlRefEnum(this.yamlPathLong, addedChild.name);
  }

  async getData(query: any) {
    return this.childrenEditables.map((editable) => editable.name);
  }
  async remove(deleteTarget: { folderName: string }) {
    if (deleteTarget.folderName === "default") {
      throw new Error("Cannot delete the default enum");
    }
    await super.remove(deleteTarget);
    await updateYamlRefEnum(this.yamlPathLong, deleteTarget.folderName, true);
  }

  async update(update: UpdateObj) {
    await super.update(update);
    await updateYamlRefEnum(this.yamlPathLong, update.oldName, true);
    await updateYamlRefEnum(this.yamlPathLong, update.newName);
  }
  getRegisterID(): string {
    return EnumFolderType.REGISTER_ID;
  }
}
