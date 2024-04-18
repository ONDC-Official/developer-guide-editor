const {
  getSheets,
  sheetsToYAML,
  addRow,
} = require("./ComponentType/AttributeType/attributeYamlUtils.js");
const { Editable } = require("./Editable.js");
const { readYamlFile } = require("./fileUtils.js");
const { overrideYaml } = require("./yamlUtils.js");

class FileTypeEditable extends Editable {
  static REGISTER_ID = "FILE";
  constructor(path, name) {
    super(path, name);
  }

  /** get data easy to display in ui */
  async getData() {
    return await this.rawToReadable(this.getRawData());
  }
  /** get raw data from yaml */
  async getRawData() {}

  async rawToReadable(yamlData) {}

  async readableToRaw(readableData) {}
}

class AttributeFile extends FileTypeEditable {
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

module.exports = { FileTypeEditable, AttributeFile };
