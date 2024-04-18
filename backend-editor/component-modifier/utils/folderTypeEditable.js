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
   * @param {Object} newEditable - The new editable object to add.
   * @param {string} newEditable.ID - The unique identifier for the editable.
   * @param {string} newEditable.name - The name of the editable.
   */
  async add(newEditable) {
    this.chilrenEditables.push(
      await EditableRegistry.create(
        newEditable.ID,
        this.longPath + `/${newEditable.name}`,
        newEditable.name
      )
    );
  }
  /**
   * Adds a new editable to the childrenEditables array.
   *
   * @param {Object} deleteTarget - The new editable object to delete.
   * @param {string} deleteTarget.ID - The unique identifier for the editable.
   * @param {string} deleteTarget.name - The name of the editable.
   */
  async remove(deleteTarget) {
    const target = this.chilrenEditables.find(
      (s) =>
        s.getRegisterID() === deleteTarget.ID && s.name === deleteTarget.name
    );
    this.chilrenEditables = this.chilrenEditables.filter((s) => s !== target);
    await target.destroy();
  }
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
