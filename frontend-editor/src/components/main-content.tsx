import React from "react";
import AttributesTable from "./attribute-table";
import { Editable } from "./file-structure";
import { AttributeFolderID } from "../pages/home-page";

export function MainContent({
  acitiveEditable,
}: {
  acitiveEditable: Editable | undefined;
}) {
  if (!acitiveEditable) return <></>;
  return (
    <>
      {acitiveEditable?.registerID === AttributeFolderID && (
        <AttributesTable attribute={acitiveEditable} />
      )}
    </>
  );
}
