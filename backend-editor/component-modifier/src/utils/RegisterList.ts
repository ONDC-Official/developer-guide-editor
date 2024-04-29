import { AttributesFolderTypeEditable } from "./ComponentType/AttributeType/AttributesFolderTypeEditable";
import { ComponentsType } from "./ComponentType/ComponentsFolderTypeEditable";
import { EditableRegistry } from "./EditableRegistry";
import { AttributeFile } from "./ComponentType/AttributeType/AttributeRow";
import { EnumFileType } from "./ComponentType/enumType/enumFileType";

export function initRegistry() {
  EditableRegistry.register(ComponentsType);
  EditableRegistry.register(AttributesFolderTypeEditable);
  EditableRegistry.register(AttributeFile);
  EditableRegistry.register(EnumFileType);
}

export const FixedNames = {
  ATTRIBUTES_FOLDER: "attributes",
};
