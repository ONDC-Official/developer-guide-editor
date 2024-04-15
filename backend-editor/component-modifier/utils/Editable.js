const { folderTypeEditable } = require("./folderTypeEditable.js");
const { updateYamlRef } = require("./yamlEditor.js");

const createIndexYaml = require("./fileUtils.js").createIndexYaml;
exports.createIndexYaml = createIndexYaml;
class Editable {
  constructor(id) {
    if (this.constructor == Editable) {
      throw new Error("Abstract classes can't be instantiated.");
    }
  }
  async add(something) {
    throw new Error("Method 'add()' must be implemented.");
  }
  async remove(something) {
    throw new Error("Method 'remove()' must be implemented.");
  }
  async update(something) {
    throw new Error("Method 'update()' must be implemented.");
  }
}

exports.Editable = Editable;
