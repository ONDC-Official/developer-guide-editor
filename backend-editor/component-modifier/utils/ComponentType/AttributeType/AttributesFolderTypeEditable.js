const { folderTypeEditable } = require("../../folderTypeEditable.js");

class AttributesFolderTypeEditable extends folderTypeEditable {
  static REGISTER_ID = "ATTRIBUTES-FOLDER";
  constructor(path, id) {
    super(path, id);
  }
  add(something) {}
}

class FileTypeEditable extends folderTypeEditable {
  static REGISTER_ID = "FILE";
  constructor(path, id) {
    super(path, id);
  }
  add(something) {}
}
