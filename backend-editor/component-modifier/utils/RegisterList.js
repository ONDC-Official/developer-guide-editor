const {
  AttributesFolderTypeEditable,
} = require("./ComponentType/AttributeType/AttributesFolderTypeEditable");
const {
  ComponentsType,
} = require("./ComponentType/ComponentsFolderTypeEditable");
const { EditableRegistry } = require("./EditableRegistry");
const { AttributeFile } = require("./FileTypeEditable");

function initRegistry() {
  EditableRegistry.register(ComponentsType);
  EditableRegistry.register(AttributesFolderTypeEditable);
  EditableRegistry.register(AttributeFile);
}

const FixedNames = {
  ATTRIBUTES_FOLDER: "attributes",
};

module.exports = { initRegistry, FixedNames };
