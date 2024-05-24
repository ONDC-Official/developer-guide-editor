import { AttributesFolderTypeEditable } from "./ComponentType/AttributeType/AttributesFolderTypeEditable";
import { ComponentsType } from "./ComponentType/ComponentsFolderTypeEditable";
import { EditableRegistry } from "./EditableRegistry";
import { AttributeFile } from "./ComponentType/AttributeType/AttributeRow";
import { EnumFileType } from "./ComponentType/enumType/enumFileType";
import { EnumFolderType } from "./ComponentType/enumType/enumFolderType";
import { TagsFolderType } from "./ComponentType/tagType/tagsFolderType";
import { TagFileType } from "./ComponentType/tagType/tagFileType";
import { FlowFolderType } from "./ComponentType/flowType/flowFolderType";
import { FlowFileType } from "./ComponentType/flowType/flowFileType";
import { ExampleFolderType } from "./ComponentType/examplesType/exampleFolderType";
import { ExampleDomainFolderType } from "./ComponentType/examplesType/ExampleDomainFolderType";

export function initRegistry() {
  EditableRegistry.register(ComponentsType);
  EditableRegistry.register(AttributesFolderTypeEditable); // main folder structure
  EditableRegistry.register(AttributeFile); // files inside that folder
  EditableRegistry.register(EnumFileType); 
  EditableRegistry.register(EnumFolderType);  
  EditableRegistry.register(TagsFolderType);
  EditableRegistry.register(TagFileType);
  EditableRegistry.register(FlowFolderType);
  EditableRegistry.register(FlowFileType);


  EditableRegistry.register(ExampleFolderType);
  EditableRegistry.register(ExampleDomainFolderType);
}

export const FixedNames = {
  ATTRIBUTES_FOLDER: "attributes",
};
