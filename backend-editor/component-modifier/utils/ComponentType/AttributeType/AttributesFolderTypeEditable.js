const { folderTypeEditable } = require("../../folderTypeEditable.js");

class AttributesFolderTypeEditable extends folderTypeEditable {
  static REGISTER_ID = "ATTRIBUTES-FOLDER";
  constructor(path, id) {
    super(path, id);
    this.allowedChildren = ["ATTRIBUTE-FILE"];
  }
  add(new_editable) {
    if (!this.allowedChildren.includes(new_editable.ID)) {
      throw new Error("Attributes only allow ATTRIBUTE-FILE children.");
    }
    super.add(new_editable);
  }
}
