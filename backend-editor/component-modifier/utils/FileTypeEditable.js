const {
  getSheets,
  sheetsToYAML,
} = require("./ComponentType/AttributeType/attributeYamlUtils.js");
const { Editable } = require("./Editable.js");
const { readYamlFile } = require("./fileUtils.js");

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
   *  @param {string} additionObject.type - type of addition
   */
  async add(additionObject) {
    if (additionObject.type === "sheet") {
      await this.addSheet(additionObject);
    } else if (additionObject.type === "attribute") {
      await this.addAttribute(additionObject);
    }
  }
  async getData() {
    console.log("hello");
    return getSheets(await readYamlFile(this.yamlPathLong));
  }
  async addSheet(sheet) {
    console.log(sheet);
    const data = await this.getData();
    data[sheet.name] = [];
    sheetsToYAML(data);
  }
  async addAttribute(attribute) {
    data = await this.getData();
    // getsheet then addon sheet
  }
}

module.exports = { FileTypeEditable, AttributeFile };
