const {
  AttributesFolderTypeEditable,
} = require("./ComponentType/AttributeType/AttributesFolderTypeEditable");
const {
  ComponentsType,
} = require("./ComponentType/ComponentsFolderTypeEditable");
const { EditableRegistry } = require("./Editable");
const { AttributeFile } = require("./FileTypeEditable");

function initRegistry() {
  EditableRegistry.register(ComponentsType);
  EditableRegistry.register(AttributesFolderTypeEditable);
  EditableRegistry.register(AttributeFile);
}

module.exports = { initRegistry };
