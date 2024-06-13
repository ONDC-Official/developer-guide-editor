import { ComponentsType } from "../ComponentType/ComponentsFolderTypeEditable";
import { TagFileType } from "../ComponentType/tagType/tagFileType";
import { TagsFolderType } from "../ComponentType/tagType/tagsFolderType";

// save the path and info in a file

interface searchObject {
  path: string;
  description?: string;
}

export async function SearchPath(
  path: string,
  value: string,
  domain: string,
  apiName: string,
  comp: ComponentsType
) {
  // search in attributes
  // search in enums
  // search in tags
  // and if possible search in bekn core
  const searchObj: searchObject = {
    path: path,
  };

  let tags = comp.childrenEditables.find(
    (s) => s.getRegisterID() === TagsFolderType.REGISTER_ID
  ) as TagsFolderType;
  if (tags) {
    const defTag = tags.childrenEditables.find(
      (s) => s.name === "default"
    ) as TagFileType;
    const tagData = await defTag.getData();
    if (!tagData[apiName]) return;
    const pathData = tagData[apiName].find((s) => s.path === path);
    if (pathData) {
      const description = "";
    }
  }
}
