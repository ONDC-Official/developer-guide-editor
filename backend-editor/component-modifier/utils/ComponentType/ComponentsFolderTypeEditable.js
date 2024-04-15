const {
  folderTypeEditable,
  AttributesFolderTypeEditable,
} = require("../folderTypeEditable.js");

class ComponentsType extends folderTypeEditable {
  static REGISTER_ID = "COMPONENTS-FOLDER";
  constructor(path, id) {
    super(path, id);
    this.allowedList = [AttributesFolderTypeEditable.REGISTER_ID];
  }
  add(new_editable) {
    if (!this.allowedList.includes(new_editable.ID)) {
      throw new Error("GIVEN TYPE IS NOT ALLOWED IN " + REGISTER_ID);
    }
    super.add(new_editable);
    updateYamlRef(this.yamlPathLong, new_editable.name, new_editable.shortPath);
  }
}
const components = new ComponentsType(
  "../../ONDC-NTS-Specifications/api",
  "components"
);

components.add({
  ID: "COMPONENTS-FOLDER",
  name: "cp0",
});
