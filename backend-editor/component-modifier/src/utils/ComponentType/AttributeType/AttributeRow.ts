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

  async add(additionObject: AttributeOperation) {
    console.log(additionObject);
    const workSheet = additionObject.sheetName;
    const data = await this.getData();
    if (!data[workSheet] || !additionObject.attributes) {
      await this.addSheet(additionObject.sheetName, data);
    } else if (!data[workSheet] && additionObject.attributes) {
      throw new Error("Sheet not found, please add sheet first");
    } else {
      await this.addAttribute(additionObject, data);
    }
  }

  async getData() {
    return getSheets(await readYamlFile(this.yamlPathLong));
  }
  async remove(deletionObject: AttributeOperation) {
    const workSheet = deletionObject.sheetName;
    const data = await this.getData();
    if (!data[workSheet]) {
      throw new Error("Sheet not found");
    }
    if (!deletionObject.attributes) {
      await this.removeSheet(deletionObject.sheetName, data);
      return;
    }
    await this.removeAttributes(deletionObject, data);
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
  async addSheet(sheet, data) {
    console.log(sheet, data);
    data[sheet] = [];
    var yml = sheetsToYAML(data);
    await overrideYaml(this.yamlPathLong, yml);
  }
  async removeSheet(workSheet: string, data: {}) {
    delete data[workSheet];
    const yml = sheetsToYAML(data);
    overrideYaml(this.yamlPathLong, yml);
  }
  async addAttribute(attribute: AttributeOperation, data) {
    data = addRows(data, attribute.sheetName, attribute.attributes);
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
