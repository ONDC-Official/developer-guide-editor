const { deleteFile } = require("./fileUtils");

createIndexYaml = require("./fileUtils").createIndexYaml;

class Editable {
  static REGISTER_ID = "EDITABLE";
  constructor(path, name) {
    if (this.constructor == Editable) {
      throw new Error("Abstract classes can't be instantiated.");
    }
    console.log(path);
    this.longPath = path;
    this.yamlPathShort = `./${name}/index.yaml`;
    this.name = name;
    // this.initIndexYaml(path);
  }
  async destroy() {
    await deleteFile(this.yamlPathLong);
  }
  async initIndexYaml(path) {
    this.yamlPathLong = await createIndexYaml(path);
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
  async getData() {
    throw new Error("Method 'getData()' must be implemented.");
  }
  async saveData(savePath) {
    throw new Error("Method 'saveData()' must be implemented.");
  }
  getRegisterID() {
    return this.constructor.REGISTER_ID;
  }
}

class EditableRegistry {
  static registry = {};

  static register(cls) {
    this.registry[cls.REGISTER_ID] = cls;
  }
  static async create(type, path, name) {
    const cls = this.registry[type];
    if (!cls) {
      throw new Error(`No registered class with ID ${type}`);
    }
    var object = new cls(path, name);
    await object.initIndexYaml(path);
    return object;
  }
}

exports.Editable = Editable;
exports.EditableRegistry = EditableRegistry;
