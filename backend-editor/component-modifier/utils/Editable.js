const { deleteFolderSync } = require("./fileUtils");

createIndexYaml = require("./fileUtils").createIndexYaml;

class Editable {
  static REGISTER_ID = "EDITABLE";

  constructor(path, name) {
    if (this.constructor == Editable) {
      throw new Error("Abstract classes can't be instantiated.");
    }
    this.longPath = path;
    this.name = name;
  }
  async destroy() {
    console.log("Destroying", this.constructor.REGISTER_ID, this.folderPath);
    await deleteFolderSync(this.folderPath);
  }
  async initIndexYaml(path, removeContent = true) {
    [this.yamlPathLong, this.folderPath] = await createIndexYaml(
      path,
      removeContent
    );
    console.log("YAML Path:", this.yamlPathLong);
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
  async loadData() {
    throw new Error("Method 'loadData()' must be implemented.");
  }
}

exports.Editable = Editable;
