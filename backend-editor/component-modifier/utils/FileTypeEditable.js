const {
  getSheets,
} = require("./ComponentType/AttributeType/attributeYamlUtils.js");
const { Editable } = require("./Editable.js");
const { readYamlFile } = require("./fileUtils.js");

class FileTypeEditable extends Editable {
  static REGISTER_ID = "FILE";
  constructor(path, name) {
    super(path, name);
  }
  /** get data easy to display in ui */
  getData() {
    return this.rawToReadable(this.getRawData());
  }
  /** get raw data from yaml */
  getRawData() {}

  rawToReadable(yamlData) {}

  readableToRaw(readableData) {}
}

class AttributeFile extends FileTypeEditable {
  static REGISTER_ID = "ATTRIBUTE-FILE";
  constructor(path, name) {
    super(path, name);
  }

  getRawData() {
    this.raw_data = readYamlFile(this.longPath);
    return this.raw_data;
  }
  rawToReadable(yamlData) {
    return getSheets(yamlData);
  }
  getColumns() {
    return ["Path", "Required", "Type", "Owner", "Usage", "Description"];
  }
}
