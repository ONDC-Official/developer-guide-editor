import React from "react";
import AttributesTable from "./attribute-table";
import { Editable } from "./file-structure";
import { AttributeFolderID } from "../pages/home-page";

export function MainContent({
  acitiveEditable,
}: {
  acitiveEditable: Editable;
}) {
  // console.log(acitiveEditable);
  return (
    <>
      {acitiveEditable?.registerID === AttributeFolderID && (
        <AttributesTable path={acitiveEditable.path} />
      )}
    </>
  );
}
