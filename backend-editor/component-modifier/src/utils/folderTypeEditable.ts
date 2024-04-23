import { Editable } from "./Editable";
import { EditableRegistry } from "./EditableRegistry";

export abstract class folderTypeEditable extends Editable {
  chilrenEditables: Editable[];
  allowedList: string[];
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
    console.log(this.chilrenEditables.map((s) => s.name));
    if (this.chilrenEditables.map((s) => s.name).includes(newEditable.name)) {
      throw new Error("Editable Already Exists!");
    }
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
   * @param {Object} deleteTarget - The new editable object to delete.
   */
  async remove(deleteTarget) {
    console.log("DELETING", deleteTarget);
    const target = this.chilrenEditables.find(
      (s) =>
        s.getRegisterID() === deleteTarget.getRegisterID() &&
        s.name === deleteTarget.name
    );
    this.chilrenEditables = this.chilrenEditables.filter((s) => s !== target);
    console.log(target);
    await target.destroy();
  }
  async update(Editable) {}

  findParent(id, name, first): Editable | string {
    const searchChildEditable = (editable) => {
      if (!("chilrenEditables" in editable)) {
        return null;
      }
      for (const childEditable of editable.chilrenEditables) {
        if (
          childEditable.getRegisterID() === id &&
          childEditable.name === name
        ) {
          return editable;
        }
        const target = searchChildEditable(childEditable);
        if (target) {
          return target;
        }
      }
      return null;
    };
    if (first.getRegisterID() === id && first.name === name) {
      return "-1";
    }
    const target = searchChildEditable(first);
    return target;
  }

  getTarget(id, name, first): Editable {
    const searchChildEditable = (editable) => {
      console.log(editable.getRegisterID(), editable.name);
      if (editable.getRegisterID() === id && editable.name === name) {
        return editable;
      }
      if (!("chilrenEditables" in editable)) {
        return null;
      }
      console.log(editable);
      for (const childEditable of editable.chilrenEditables) {
        console.log(
          "ITERATING: ",
          childEditable.getRegisterID(),
          childEditable.name
        );
        const target = searchChildEditable(childEditable);
        if (target) {
          console.log("FOUND!");
          return target;
        }
      }
      console.log("ITERATION FAILED!");
      return null;
    };

    const target = searchChildEditable(first);
    if (!target) {
      console.log("SEARCH FAILED!");
      throw new Error("Editable Not Found!");
    }
    return target;
  }
}
