import { close } from "fs";
import { Editable } from "./Editable";
import { EditableRegistry } from "./EditableRegistry";
import { FileTypeEditable } from "./FileTypeEditable";

export interface UpdateObj {
  oldName: string;
  newName: string;
}

export abstract class folderTypeEditable extends Editable {
  childrenEditables: Editable[];
  allowedList: string[];
  constructor(path, name) {
    super(path, name);
    this.childrenEditables = [];
  }
  async add(newEditable: { ID: string; name: string }) {
    console.log(this.childrenEditables.map((s) => s.name));
    if (this.childrenEditables.map((s) => s.name).includes(newEditable.name)) {
      throw new Error("Editable Already Exists!");
    }
    this.childrenEditables.push(
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
  async remove(deleteTarget: { folderName: string }) {
    console.log("DELETING", deleteTarget);
    const target = this.childrenEditables.find(
      (s) => s.name === deleteTarget.folderName
    );
    this.childrenEditables = this.childrenEditables.filter((s) => s !== target);
    // console.log(target);
    await target.destroy();
  }

  async update(update: UpdateObj) {
    console.log("PATCHING", update);
    const target = this.childrenEditables.find(
      (s) => s.name === update.oldName
    );
    try {
      await target.renameFolder(update.newName);
    } catch (e) {
      throw new Error(e.message);
    }
  }

  findParent(id, name, first): Editable | string {
    const searchChildEditable = (editable: Editable) => {
      if (editable instanceof FileTypeEditable) {
        return null;
      }
      if (!(editable instanceof folderTypeEditable)) {
        return;
      }
      for (const childEditable of editable.childrenEditables) {
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
    const searchChildEditable = (editable: Editable) => {
      // console.log(editable.getRegisterID(), editable.name);
      if (editable.getRegisterID() === id && editable.name === name) {
        return editable;
      }
      if (
        editable instanceof FileTypeEditable ||
        !(editable instanceof folderTypeEditable)
      ) {
        return null;
      }

      for (const childEditable of editable.childrenEditables) {
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
      console.log("NOT FOUND!");
      throw new Error("Editable Not Found!");
    }
    return target;
  }
}
