// AddInAttributes.js
import React from "react";
import GenericForm from "./generic-form";
import FormSelect from "./form-select";
import FormInput from "./form-input";
import { Editable } from "../file-structure";
import { FieldValues } from "react-hook-form";
import { postData } from "../../utils/requestUtils";

const AddInAttributes = ({
  data,
  setIsOpen,
}: {
  data: Editable;
  setIsOpen: any;
}) => {
  const onSubmit = async (formData: FieldValues) => {
    console.log("Data submitted for attributes:", formData);
    await postData(data.path, formData);
    await data.query?.getData();
    setIsOpen(false);
  };

  return (
    <GenericForm
      onSubmit={onSubmit}
      className="w-full mx-auto my-4 p-4 border rounded-lg shadow-blue-500"
    >
      <FormSelect
        name="ID"
        label="Attribute Type"
        options={["ATTRIBUTE_FILE"]}
      />
      <FormInput name="name" label="Attribute Name" />
    </GenericForm>
  );
};

export function AddSheet({
  data,
  setIsOpen,
}: {
  data: Editable;
  setIsOpen: any;
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

  return (
    <GenericForm
      onSubmit={onSubmit}
      className="w-full mx-auto my-4 p-4 border rounded-lg shadow-blue-500"
    >
      <FormInput name="sheet" label="Attribute Sheet Name" />
    </GenericForm>
  );
}

export const AddRowForm = ({
  data,
  setIsOpen,
}: {
  data: Editable;
  setIsOpen: any;
}) => {
  const defaultValues = data.query.rowData || {};
  if (!data.query.sheet) {
    return <div>First ADD a SHEET</div>;
  }
  const onSubmit = async (formData: FieldValues) => {
    console.log("Data submitted for row:", formData);
    const path = data.path;
    const body = {
      sheetName: data.query.sheet,
      attributes: [formData],
    };
    console.log("POSTING", path, body);
    await postData(path, body);
    await data.query?.getData();
    setIsOpen(false);
  };

  return (
    <GenericForm
      onSubmit={onSubmit}
      defaultValues={defaultValues}
      className="w-full mx-auto my-4 p-4 border rounded-lg shadow-blue-500"
    >
      <FormInput name="path" label="Path" required={true} />
      <FormSelect
        name="required"
        label="Required"
        options={["true", "false"]}
      />
      <FormInput name="type" label="Type" required={true} />
      <FormInput name="owner" label="Owner" />
      <FormInput name="usage" label="Usage" />
      <FormInput name="description" label="Description" type="textarea" />
    </GenericForm>
  );
};

export default AddInAttributes;
