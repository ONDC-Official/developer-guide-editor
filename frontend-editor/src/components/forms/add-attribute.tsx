// AddInAttributes.js
import React, { useEffect, useState } from "react";
import GenericForm from "./generic-form";
import FormSelect from "./form-select";
import { FormInput } from "./form-input";
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
  let path = data.path;
  if (data.path.split("/").length > 2) {
    path = data.path.split("/").slice(0, -1).join("/");
  }
  const onPost = async (formData: FieldValues) => {
    console.log("Data submitted for attributes:", formData);

    console.log(path);
    await postData(path, formData);
    await data.query?.getData();
    setIsOpen(false);
  };
  const onPatch = async (formData: FieldValues) => {
    console.log("Data submitted for attributes:", formData);
    await patchData(path, formData);
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
            labelInfo="Select the type of attribute you want to add"
          />
          <FormInput name="name" label="Domain" strip={true} />
        </GenericForm>
      </>
    );
  }
  function EditForm() {
    const [option, setOptions] = useState([]);
    const path = data.path.split("/").slice(0, -1).join("/");
    useEffect(() => {
      const fetchOptions = async () => {
        const fetched = await getData(path);
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
  if (!data.query.Parent) {
    return <div>First ADD a ATTRIBUTE_FILE</div>;
  }
  const onSubmit = async (formData: FieldValues) => {
    const path = data.path;
    const body: Record<string, any> = {};
    body[formData.sheet] = [];
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
    const body: Record<string, any> = {};
    body[data.query.addParams?.sheet] = [formData];
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
        labelInfo="This field indicate json path in the payload & in case the type is object add ._description to the path"
        required={true}
        strip={true}
        disable={editState ? true : false}
      />
      <FormSelect
        name="required"
        label="Required"
        labelInfo="This field indicates whether the attribute is optional or required."
        options={["MANDATORY", "OPTIONAL"]}
      />
      <FormSelect
        name="type"
        label="Type"
        labelInfo="This field specifies the data type of the attribute within the payload."
        required={true}
        options={["NUMERIC", "TEXT", "OBJECT", "BOOLEAN"]}
      />
      <FormSelect
        name="owner"
        label="Owner"
        labelInfo="This field specifies the owner of the attribute. 
        BAP: buyer app provider or the buyer app
        BPP: beckn provider platform or the seller app
        BAP/BPP: owner can be any."
        options={["BAP", "BPP", "BAP/BPP"]}
      />
      <FormInput
        name="usage"
        label="Usage"
        labelInfo="This field provides a sample value that can be used in the payload."
      />
      <FormInput
        name="description"
        label="Description"
        type="textarea"
        labelInfo="Describes usage of the attribute"
      />
    </GenericForm>
  );
};

export default AddInAttributes;
