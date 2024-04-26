import React from "react";
import AttributesTable from "./attribute-table";
import { Editable } from "./file-structure";
import { AttributeFolderID } from "../pages/home-page";

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
    </>
  );
}
