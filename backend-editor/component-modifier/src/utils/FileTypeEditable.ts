import {
  getSheets,
  sheetsToYAML,
  addRow,
} from "./ComponentType/AttributeType/attributeYamlUtils";
import { Editable } from "./Editable";
import { readYamlFile } from "./fileUtils";
import { overrideYaml } from "./yamlUtils";

export abstract class FileTypeEditable extends Editable {
  constructor(path, name) {
    super(path, name);
  }
  /** get data easy to display in ui */
  // async getData() {
  //   // return await this.rawToReadable(this.getRawData());
  // }
  /** get raw data from yaml */
  async getRawData() {}

  async rawToReadable(yamlData) {}

  async readableToRaw(readableData) {}
}

export class AttributeFile extends FileTypeEditable {
  getRegisterID(): string {
    return AttributeFile.REGISTER_ID;
  }
  static REGISTER_ID = "ATTRIBUTE_FILE";
  constructor(path, name) {
    super(path, name);
  }

  /** performs addition in attribute index.yaml
   *  @param {Object} additionObject - object to add
   *  @param {string} additionObject.sheet - target sheet
   *
   */
  async add(additionObject) {
    const workSheet = additionObject.sheet;
    const data = await this.getData();
    if (!data[workSheet]) {
      console.log("sheet not found");
      await this.addSheet(workSheet, data);
    } else {
      console.log("sheet found");
      await this.addAttribute(additionObject, data);
    }
  }
  async getData() {
    return getSheets(await readYamlFile(this.yamlPathLong));
  }
  async remove(something: any) {
    throw new Error("Method not implemented.");
  }
  async update(something: any) {
    throw new Error("Method not implemented.");
  }
  async addSheet(sheet, data) {
    data[sheet] = [];
    var yml = sheetsToYAML(data);
    overrideYaml(this.yamlPathLong, yml);
  }
  async addAttribute(attribute, data) {
    addRow(data[attribute.sheet], attribute);
    const yml = sheetsToYAML(data);
    overrideYaml(this.yamlPathLong, yml);
  }
}
