import React from "react";
import AttributesTable from "./attribute-table";
import { Editable } from "./file-structure";
import {
  AttributeFolderID,
  EnumFolderID,
  ExampleFolderID,
  TagFolderID,
  flowFolderID,
} from "../pages/editor-page";

import { EnumContent, EnumFolderContent } from "./EnumContent";
import { TagsFolderContent } from "./tag-content";
import { FlowFolderContent } from "./flow-content";
import { ExampleContent } from "./example-content";

export function MainContent({
  activeEditable,
}: {
  activeEditable: Editable | undefined;
}) {
  console.log(activeEditable, "activeEditable");

  if (!activeEditable) return <></>;
  return (
    <>
      {activeEditable?.registerID === AttributeFolderID && (
        <AttributesTable attribute={activeEditable} />
      )}
      {activeEditable?.registerID === EnumFolderID && (
        <EnumFolderContent enumFolder={activeEditable} />
      )}
      {activeEditable?.registerID === TagFolderID && (
        <TagsFolderContent tagFolder={activeEditable} />
      )}
      {/* activeEditable is nothing but the object containg information about current right side section
      that is opened  */}
      {activeEditable?.registerID === flowFolderID && (
        <FlowFolderContent flowFolder={activeEditable} />
      )}
      {activeEditable?.registerID === ExampleFolderID && (
        <ExampleContent exampleEditable={activeEditable} />
      )}
    </>
  );
}
