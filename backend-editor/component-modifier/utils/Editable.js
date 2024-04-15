class Editable {
  static REGISTER_ID = "EDITABLE";
  constructor() {
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

class EditableRegistry {
  static registry = {};

  static register(cls) {
    this.registry[cls.id] = cls;
  }
  static create(type, path, name) {
    const cls = this.registry[type];
    if (!cls) {
      throw new Error(`No registered class with ID ${type}`);
    }
    return new cls(path, name);
  }

  static displayId() {
    console.log(`Item ID: ${this.id}`);
  }
}

exports.Editable = Editable;
exports.EditableRegistry = EditableRegistry;
