import React, { useContext, useState } from "react";
import { Editable } from "../file-structure";
import AddInComponent from "./add-component";
import AddInAttributes, { AddRowForm, AddSheet } from "./add-attribute";
import {
  AttributeFileID,
  AttributeFolderID,
  CompFolderID,
  EnumFileId,
  EnumFolderID,
  ExampleDomainFolderID,
  ExampleFolderID,
  TagFileID,
  TagFolderID,
} from "../../pages/home-page";
import { EnumApiForm, EnumFolderForm, EnumForm } from "./enum-Form";
import JsonField from "./JsonField";
import { postData } from "../../utils/requestUtils";
import {
  TagApiForm,
  TagCodesForm,
  TagFolderForm,
  TagGroupForm,
  TagPathForm,
} from "./tag-forms";
import {
  AddExampleJsonForm,
  AddNewExampleForm,
  ExampleDomainForm,
} from "./example-form";

export interface FormFacProps {
  data: Editable;
  setIsOpen: any;
  editState: boolean;
}

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
    const formPath = data.registerID.split("/")[0];
    console.log("Form Path", formPath);
    switch (formPath) {
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
      case EnumFolderID:
        return (
          <EnumFolderForm
            data={data}
            setIsOpen={setIsOpen}
            editState={editState}
          />
        );
      case EnumFileId:
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
      case TagFolderID:
        if (data.query.addParams?.formType === "addAPI") {
          return (
            <TagApiForm
              data={data}
              setIsOpen={setIsOpen}
              editState={editState}
            />
          );
        }
        return (
          <TagFolderForm
            data={data}
            setIsOpen={setIsOpen}
            editState={editState}
          />
        );
      case TagFileID:
        if (data.query.addParams?.formType === "addTag") {
          return (
            <TagCodesForm
              data={data}
              setIsOpen={setIsOpen}
              editState={editState}
            />
          );
        }
        if (data.query.addParams?.formType === "addTagGroup") {
          return (
            <TagGroupForm
              data={data}
              setIsOpen={setIsOpen}
              editState={editState}
            />
          );
        }
        return (
          <TagPathForm
            data={data}
            setIsOpen={setIsOpen}
            editState={editState}
          />
        );
      case ExampleFolderID:
        // if (data.query.addParams?.formType === "addDomain") {
        //   return <></>;
        // }
        return (
          <ExampleDomainForm
            data={data}
            setIsOpen={setIsOpen}
            editState={editState}
          />
        );
      case ExampleDomainFolderID:
        if (data.query.addParams?.formType === "AddExample") {
          return (
            <AddExampleJsonForm
              data={data}
              setIsOpen={setIsOpen}
              editState={editState}
            />
          );
        }
        return (
          <AddNewExampleForm
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

  const onRawSubmit = async (code: string) => {
    console.log("Posing data", code);
    await postData(data.path, JSON.parse(code));
    await data.query.getData();
    setIsOpen(false);
  };

  return (
    <>
      {!editState && (
        <button
          onClick={() => setRawState(!rawState)}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white font-mono font-semibold shadow-lg transition duration-300 ease-linear transform hover:scale-105"
        >
          {rawState ? "Form" : "Raw"}
        </button>
      )}
      {rawState && (
        <>
          <h1 className="text-base font-semibold text-gray-800 mb-2 mt-2">
            Path: {data.path}
          </h1>
          <JsonField onSubmit={onRawSubmit} />
        </>
      )}
      {!rawState && renderForm()}
    </>
  );
};

export default FormFactory;
