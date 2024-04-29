import React from "react";
import AttributesTable from "./attribute-table";
import { Editable } from "./file-structure";
import { AttributeFolderID, EnumFileID } from "../pages/home-page";

import { EnumContent } from "./EnumContent";

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
      {activeEditable?.registerID === EnumFileID && (
        <EnumContent enums={activeEditable} />
      )}
    </>
  );
}
