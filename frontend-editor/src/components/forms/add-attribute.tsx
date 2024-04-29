// AddInAttributes.js
import React, { useEffect, useState } from "react";
import GenericForm from "./generic-form";
import FormSelect from "./form-select";
import FormInput from "./form-input";
import { Editable } from "../file-structure";
import { FieldValues } from "react-hook-form";
import { getData, patchData, postData } from "../../utils/requestUtils";

const AddInAttributes = ({
  data,
  setIsOpen,
  editState,
}: {
  data: Editable;
  setIsOpen: any;
  editState: boolean;
}) => {
  const onPost = async (formData: FieldValues) => {
    console.log("Data submitted for attributes:", formData);
    await postData(data.path, formData);
    await data.query?.getData();
    setIsOpen(false);
  };
  const onPatch = async (formData: FieldValues) => {
    console.log("Data submitted for attributes:", formData);
    await patchData(data.path, formData);
    await data.query?.getData();
    setIsOpen(false);
  };

  function AddForm() {
    return (
      <>
        <GenericForm
          onSubmit={onPost}
          className="w-full mx-auto my-4 p-4 border rounded-lg shadow-blue-500"
        >
          <FormSelect
            name="ID"
            label="Attribute Type"
            options={["ATTRIBUTE_FILE"]}
          />
          <FormInput name="name" label="Domain" strip={true} />
        </GenericForm>
      </>
    );
  }
  function EditForm() {
    const [option, setOptions] = useState([]);
    useEffect(() => {
      const fetchOptions = async () => {
        const fetched = await getData(data.path);
        setOptions(fetched);
      };
      fetchOptions();
    }, []);
    return (
      <>
        <GenericForm
          onSubmit={onPatch}
          className="w-full mx-auto my-4 p-4 border rounded-lg shadow-blue-500"
        >
          <FormSelect
            name="oldName"
            label="Select Damain to edit"
            options={option.length ? option : ["Loading..."]}
          />
          <FormInput name="newName" label="new name" strip={true} />
        </GenericForm>
      </>
    );
  }
  if (editState) {
    return <EditForm />;
  }
  return <AddForm />;
};

export function AddSheet({
  data,
  setIsOpen,
  editState,
}: {
  data: Editable;
  setIsOpen: any;
  editState: boolean;
}) {
  if (!data.name) {
    return <div>First ADD a ATTRIBUTE_FILE</div>;
  }
  const onSubmit = async (formData: FieldValues) => {
    const path = data.path;
    const body = {
      sheetName: formData.sheet,
    };
    console.log("POSTING", path, body);
    await postData(path, body);
    await data.query?.getData();
    setIsOpen(false);
  };
  const onPatch = async (formData: FieldValues) => {
    const body = {
      type: "sheetName",
      operation: formData,
    };
    console.log("patching", data.path, body);
    await patchData(data.path, body);
    await data.query?.getData();
    setIsOpen(false);
  };
  if (editState) {
    return (
      <GenericForm
        onSubmit={onPatch}
        className="w-full mx-auto my-4 p-4 border rounded-lg shadow-blue-500"
      >
        <FormSelect
          name="oldName"
          label="Choose Api to re-name"
          options={data.query.updateParams?.getTableNames() ?? [""]}
        />
        <FormInput name="newName" label="Enter New Name" />
      </GenericForm>
    );
  }
  return (
    <GenericForm
      onSubmit={onSubmit}
      className="w-full mx-auto my-4 p-4 border rounded-lg shadow-blue-500"
    >
      <FormInput name="sheet" label="Attribute API Name" strip={true} />
    </GenericForm>
  );
}

export const AddRowForm = ({
  data,
  setIsOpen,
  editState,
}: {
  data: Editable;
  setIsOpen: any;
  editState: boolean;
}) => {
  const defaultValues = data.query.addParams?.rowData || {};
  if (!data.query.addParams?.sheet) {
    return <div>First ADD a SHEET</div>;
  }
  const onSubmit = async (formData: FieldValues) => {
    console.log("Data submitted for row:", formData);
    const path = data.path;
    const body = {
      sheetName: data.query.addParams?.sheet,
      attributes: [formData],
    };
    console.log("POSTING", path, body);
    await postData(path, body);
    await data.query?.getData();
    setIsOpen(false);
  };
  const onPatch = async (formData: FieldValues) => {
    console.log("Data submitted for row:", formData);
    const path = data.path;
    const body = {
      type: "rowData",
      operation: {
        oldName: data.query.addParams?.sheet,
        oldRows: [data.query.addParams?.rowData],
        newRows: [formData],
      },
    };
    console.log("PATCHING");
    await patchData(path, body);
    await data.query?.getData();
    setIsOpen(false);
  };

  return (
    <GenericForm
      onSubmit={editState ? onPatch : onSubmit}
      defaultValues={defaultValues}
      className="w-full mx-auto my-4 p-4 border rounded-lg shadow-blue-500"
    >
      <FormInput
        name="path"
        label="Path"
        required={true}
        strip={true}
        disable={editState ? true : false}
      />
      <FormSelect
        name="required"
        label="Required"
        options={["REQUIRED", "OPTIONAL"]}
      />
      <FormSelect
        name="type"
        label="Type"
        required={true}
        options={["NUMERIC", "TEXT", "OBJECT", "BOOLEAN"]}
      />
      <FormSelect name="owner" label="Owner" options={["BAP", "BPP"]} />
      <FormInput name="usage" label="Usage" />
      <FormInput name="description" label="Description" type="textarea" />
    </GenericForm>
  );
};

export default AddInAttributes;
