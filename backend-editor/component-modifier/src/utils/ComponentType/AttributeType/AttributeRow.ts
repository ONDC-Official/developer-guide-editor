import {
  getSheets,
  sheetsToYAML,
  addRows,
  deleteRows,
  updateRows,
} from "./attributeYamlUtils";
import { readYamlFile } from "../../fileUtils";
import { overrideYaml } from "../../yamlUtils";
import { FileTypeEditable } from "../../FileTypeEditable";

export interface AttributeRow {
  path: string;
  required?: string;
  type?: string;
  owner?: string;
  usage?: string;
  description: string;
}

export interface AttributeOperation {
  sheetName: string;
  attributes?: AttributeRow[];
}

export type AttributeType = Record<string, AttributeRow[]>;

export interface PatchAttributes {
  type: "sheetName" | "rowData";
  operation: {
    oldName: string;
    newName?: string;
    oldRows?: AttributeRow[];
    newRows?: AttributeRow[];
  };
}

export class AttributeFile extends FileTypeEditable {
  getRegisterID(): string {
    return AttributeFile.REGISTER_ID;
  }
  static REGISTER_ID = "ATTRIBUTE_FILE";
  constructor(path, name) {
    super(path, name);
  }

  async add(additionObject: AttributeType) {
    let data = await this.getData();
    for (let workSheet in additionObject) {
      console.log("WORKSHEET", workSheet);
      if (!data[workSheet]) {
        data[workSheet] = [];
      }
      data = addRows(data, workSheet, additionObject[workSheet]);
    }
    const yml = sheetsToYAML(data);
    await overrideYaml(this.yamlPathLong, yml);
  }

  async getData() {
    return getSheets(await readYamlFile(this.yamlPathLong));
  }
  async remove(deletionObject: AttributeType | { sheetName: string }) {
    let data: Record<string, any> = await this.getData();
    if (
      "sheetName" in deletionObject &&
      !Array.isArray(deletionObject.sheetName)
    ) {
      delete data[deletionObject.sheetName];
      const yml = sheetsToYAML(data);
      await overrideYaml(this.yamlPathLong, yml);
      return;
    }
    for (const sheet in deletionObject) {
      if (!data[sheet]) {
        continue;
      }
      if (deletionObject[sheet].length === 0) {
        delete data[sheet];
      } else {
        data = deleteRows(data, sheet, deletionObject[sheet]);
      }
    }

    const yml = sheetsToYAML(data);
    await overrideYaml(this.yamlPathLong, yml);
  }

  async update(patch: PatchAttributes) {
    console.log(patch);
    if (patch.type === "sheetName") {
      const data = await this.getData();
      console.log("DATA", data[patch.operation.oldName]);
      data[patch.operation.newName] = data[patch.operation.oldName];

      delete data[patch.operation.oldName];
      const yml = sheetsToYAML(data);
      await overrideYaml(this.yamlPathLong, yml);
      return;
    } else {
      const data = await this.getData();
      await updateRows(
        data,
        patch.operation.oldName,
        patch.operation.oldRows,
        patch.operation.newRows
      );
      const yml = sheetsToYAML(data);
      await overrideYaml(this.yamlPathLong, yml);
    }
  }
  async removeSheet(workSheet: string, data: {}) {
    delete data[workSheet];
    const yml = sheetsToYAML(data);
    overrideYaml(this.yamlPathLong, yml);
  }
  async removeAttributes(deletionObject: AttributeOperation, data: {}) {
    data = deleteRows(
      data,
      deletionObject.sheetName,
      deletionObject.attributes
    );
    const yml = sheetsToYAML(data);
    overrideYaml(this.yamlPathLong, yml);
  }
}
