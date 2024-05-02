import React from "react";
import AttributesTable from "./attribute-table";
import { Editable } from "./file-structure";
import { AttributeFolderID, EnumFolderID } from "../pages/home-page";

import { EnumContent, EnumFolderContent } from "./EnumContent";

export function MainContent({
  activeEditable,
}: {
  activeEditable: Editable | undefined;
}) {
  if (!activeEditable) return <></>;
  return (
    <>
      {activeEditable?.registerID === AttributeFolderID && (
        <AttributesTable attribute={activeEditable} />
      )}
      {activeEditable?.registerID === EnumFolderID && (
        <EnumFolderContent enumFolder={activeEditable} />
      )}
    </>
  );
}
