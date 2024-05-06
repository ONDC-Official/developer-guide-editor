import { AttributesFolderTypeEditable } from "./ComponentType/AttributeType/AttributesFolderTypeEditable";
import { ComponentsType } from "./ComponentType/ComponentsFolderTypeEditable";
import { EditableRegistry } from "./EditableRegistry";
import { AttributeFile } from "./ComponentType/AttributeType/AttributeRow";
import { EnumFileType } from "./ComponentType/enumType/enumFileType";
import { EnumFolderType } from "./ComponentType/enumType/enumFolderType";
import { TagsFolderType } from "./ComponentType/tagType/tagsFolderType";
import { TagFileType } from "./ComponentType/tagType/tagFileType";

export function initRegistry() {
  EditableRegistry.register(ComponentsType);
  EditableRegistry.register(AttributesFolderTypeEditable);
  EditableRegistry.register(AttributeFile);
  EditableRegistry.register(EnumFileType);
  EditableRegistry.register(EnumFolderType);
  EditableRegistry.register(TagsFolderType);
  EditableRegistry.register(TagFileType);
}

export const FixedNames = {
  ATTRIBUTES_FOLDER: "attributes",
};
