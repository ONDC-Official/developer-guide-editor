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
  async add(new_editable) {
    this.chilrenEditables.push(
      await EditableRegistry.create(
        new_editable.ID,
        this.longPath + `/${new_editable.name}`,
        new_editable.name
      )
    );
  }
  async remove(Editable) {}
  async update(Editable) {}
  getTarget(id, name, first) {
    const searchChildEditable = (editable) => {
      console.log(editable.getRegisterID(), editable.name);
      if (editable.getRegisterID() === id && editable.name === name) {
        return editable;
      }
      for (const childEditable of editable.chilrenEditables) {
        const target = searchChildEditable(childEditable);
        if (target) {
          return target;
        }
      }
      console.log("No target found");
      return null;
    };

    return searchChildEditable(first);
  }
}

module.exports = {
  folderTypeEditable,
};
