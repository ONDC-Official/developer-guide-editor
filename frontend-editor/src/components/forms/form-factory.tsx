import React, { useContext, useState } from "react";
import { Editable } from "../file-structure";
import AddInComponent from "./add-component";
import AddInAttributes, { AddRowForm, AddSheet } from "./add-attribute";
import {
  AttributeFileID,
  AttributeFolderID,
  CompFolderID,
  EnumFileID,
} from "../../pages/home-page";
import { EnumApiForm, EnumForm } from "./enum-Form";
import JsonField from "./JsonField";

const FormFactory = ({
  data,
  setIsOpen,
  editState,
}: {
  data: Editable;
  setIsOpen: any;
  editState: boolean;
}) => {
  const renderForm = () => {
    switch (data.registerID) {
      case CompFolderID:
        return <AddInComponent data={data} setIsOpen={setIsOpen} />;
      case AttributeFolderID:
        return (
          <AddInAttributes
            data={data}
            setIsOpen={setIsOpen}
            editState={editState}
          />
        );
      case AttributeFileID:
        if (data.query.addParams?.type === "addRow") {
          return (
            <AddRowForm
              data={data}
              setIsOpen={setIsOpen}
              editState={editState}
            />
          );
        } else {
          return (
            <AddSheet data={data} setIsOpen={setIsOpen} editState={editState} />
          );
        }
      case EnumFileID:
        if (data.query.addParams?.type === "enum") {
          return (
            <EnumForm data={data} setIsOpen={setIsOpen} editState={editState} />
          );
        }
        return (
          <EnumApiForm
            data={data}
            setIsOpen={setIsOpen}
            editState={editState}
          />
        );
      default:
        return <div>No form available for this type.</div>;
    }
  };

  const [rawState, setRawState] = useState(false);

  return (
    <>
      <button
        onClick={() => setRawState(!rawState)}
        className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white font-mono font-semibold shadow-lg transition duration-300 ease-linear transform hover:scale-105"
      >
        {rawState ? "Form" : "Raw"}
      </button>
      {rawState && <JsonField />}
      {!rawState && renderForm()}
    </>
  );
};

export default FormFactory;
