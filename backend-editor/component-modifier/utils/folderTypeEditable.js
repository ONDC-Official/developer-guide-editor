const {
  Editable,
  createIndexYaml,
  EditableRegistry,
} = require("./Editable.js");

class folderTypeEditable extends Editable {
  constructor(path, name) {
    super(path, name);
    this.chilrenEditables = [];
  }
  /**
   * Adds a new editable to the childrenEditables array.
   *
   * @param {Object} new_editable - The new editable object to add.
   * @param {string} new_editable.ID - The unique identifier for the editable.
   * @param {string} new_editable.name - The name of the editable.
   */
  add(new_editable) {
    this.chilrenEditables.push(
      EditableRegistry.create(
        new_editable.ID,
        this.longPath + `${new_editable.name}}/index.yaml`,
        new_editable.name
      )
    );
  }
  remove(Editable) {}
  update(Editable) {}
}

module.exports = {
  folderTypeEditable,
};
