import { folderTypeEditable, UpdateObj } from "../../folderTypeEditable";
import { updateYamlRefFlow } from "../../yamlUtils";
import { FlowFileType } from "./flowFileType";

export class FlowFolderType extends folderTypeEditable {
  static REGISTER_ID = "FLOW_FOLDER";

  constructor(path: string, name: string) {
    super(path, name);
    this.allowedList = [FlowFileType.REGISTER_ID];
  }

  async add(newEditable: { ID: string; name: string }) {
    await super.add(newEditable);

    const addedChild = this.childrenEditables.find(
      (s) => s.name === newEditable.name
    );

    await updateYamlRefFlow(this.yamlPathLong, addedChild.name);
  }

  async getData(query: any) {
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
    // await updateYamlRefFlow(this.yamlPathLong, deleteTarget.folderName);
    await updateYamlRefFlow(this.yamlPathLong, deleteTarget.folderName,true);
  }

  async update(update: UpdateObj) {
    await super.update(update);
    // await updateYamlRefFlow(this.yamlPathLong, update.oldName, true);
    // await updateYamlRefFlow(this.yamlPathLong, update.newName);
  }
  getRegisterID(): string {
    return FlowFolderType.REGISTER_ID;
  }
}
