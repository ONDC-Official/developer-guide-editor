import {
  getSheets,
  sheetsToYAML,
  addRows,
  deleteRows,
} from "./ComponentType/AttributeType/attributeYamlUtils";
import { Editable } from "./Editable";
import { readYamlFile } from "./fileUtils";
import { overrideYaml } from "./yamlUtils";

export abstract class FileTypeEditable extends Editable {
  constructor(path, name) {
    super(path, name);
  }
}

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
  async update(something: any) {
    throw new Error("Method not implemented.");
  }
  async addSheet(sheet, data) {
    console.log(sheet, data);
    data[sheet] = [];
    var yml = sheetsToYAML(data);
    overrideYaml(this.yamlPathLong, yml);
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
