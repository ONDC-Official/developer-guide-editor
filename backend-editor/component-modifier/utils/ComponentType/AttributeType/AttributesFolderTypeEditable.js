const { AttributeFile } = require("../../FileTypeEditable.js");
const { folderTypeEditable } = require("../../folderTypeEditable.js");
const { updateYamlRefAttr } = require("../../yamlUtils.js");

class AttributesFolderTypeEditable extends folderTypeEditable {
  static REGISTER_ID = "ATTRIBUTES-FOLDER";
  constructor(path, id) {
    console.log(path);
    super(path, id);
    this.allowedChildren = AttributeFile.REGISTER_ID;
  }
  async add(new_editable) {
    if (!this.allowedChildren.includes(new_editable.ID)) {
      throw new Error("Attributes only allow ATTRIBUTE-FILE children.");
    }
    await super.add(new_editable);
    const addedChild = this.chilrenEditables.find(
      (s) => s.name === new_editable.name
    );
    updateYamlRefAttr(this.yamlPathLong, addedChild.name);
  }
}

module.exports = { AttributesFolderTypeEditable };
