const { Editable, createIndexYaml } = require("./Editable.js");

class folderTypeEditable extends Editable {
  constructor(path, id) {
    super(id);
    this.id = id;
    this.longPath = path + "/index.yaml";
    this.shortPath = `./${id}/index.yaml`;
    createIndexYaml(path);
  }
}
exports.folderTypeEditable = folderTypeEditable;

class ComponentsFolderTypeEditable extends folderTypeEditable {
  constructor(path, id) {
    super(path);
  }
  add(something) {
    if (typeof something != folderTypeEditable) {
      throw new Error("Components can only add FolderTypeEditable");
    }
    updateYamlRef(this.longPath, "examples", "./examples/index.yaml");
  }
}

const components = new ComponentsFolderTypeEditable(
  "../../ONDC-NTS-Specifications/api",
  "components"
);

// class AttributesFolderTypeEditable extends folderTypeEditable {
//   constructor(path, id) {
//     super(path);
//   }
//   add(something) {}
// }
