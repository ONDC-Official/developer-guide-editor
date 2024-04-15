const { EditableRegistry } = require("./Editable");
const {
  ComponentsFolderTypeEditable,
  AttributesFolderTypeEditable,
} = require("./folderTypeEditable");

EditableRegistry.register(ComponentsFolderTypeEditable);
EditableRegistry.register(AttributesFolderTypeEditable);
