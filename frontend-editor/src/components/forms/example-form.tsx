import { on } from "events";
import { Editable } from "../file-structure";
import GenericForm from "./generic-form";
import FormSelect from "./form-select";
import FormInput from "./form-input";
import { getData, postData } from "../../utils/requestUtils";
import { useEffect, useState } from "react";
import { ExampleData } from "../example-content";
import JsonField from "./JsonField";

export function ExampleDomainForm({
  data,
  setIsOpen,
  editState,
}: {
  data: Editable;
  setIsOpen: any;
  editState: boolean;
}) {
  async function onPost(formData: any) {
    await postData(data.path, formData);
    await data.query?.getData();
    setIsOpen(false);
  }
  return (
    <>
      <GenericForm
        onSubmit={onPost}
        className="w-full mx-auto my-4 p-4 border rounded-lg shadow-blue-500"
      >
        <FormSelect
          name="ID"
          label="Type"
          options={["EXAMPLE_DOMAIN_FOLDER"]}
        />
        <FormInput
          name="name"
          label="Domain Name"
          strip={true}
          required={true}
        />
        <FormInput name="summary" label="Summary" />
        <FormInput name="description" label="Description" />
      </GenericForm>
    </>
  );
}

export function AddNewExampleForm({
  data,
  setIsOpen,
  editState,
}: {
  data: Editable;
  setIsOpen: any;
  editState: boolean;
}) {
  async function onPost(formData: any) {
    const body: Record<string, any> = {};
    body.ID = formData.ExampleType;
    body.name = formData.name;
    body.summary = formData.summary;
    body.description = formData.description;
    body.exampleName = formData.exampleName;
    body.exampleValue = { Dummy: "ADD NEW EXAMPLE!" };
    await postData(data.path, body);
    await data.query?.getData();
    setIsOpen(false);
  }
  const defaultValues: Record<string, any> = {};
  if (data.query.addParams?.apiCat) {
    defaultValues["name"] = data.query.addParams.apiCat;
  }
  return (
    <>
      <GenericForm
        onSubmit={onPost}
        defaultValues={defaultValues}
        className="w-full mx-auto my-4 p-4 border rounded-lg shadow-blue-500"
      >
        <FormSelect
          name="ExampleType"
          label="Example Type"
          options={["JSON", "FORM"]}
        />
        <FormInput
          name="name"
          label="Enter Api category"
          strip={true}
          required={true}
          disable={data.query.addParams?.apiCat ? true : false}
        />
        <FormInput
          name="exampleName"
          label="Enter Example Name"
          strip={true}
          required={true}
        />
        <FormInput name="summary" label="Summary" />
        <FormInput name="description" label="Description" />
      </GenericForm>
    </>
  );
}

export function AddExampleJsonForm({
  data,
  setIsOpen,
  editState,
}: {
  data: Editable;
  setIsOpen: any;
  editState: boolean;
}) {
  const defaultValues = data.query.addParams?.exampleData || {};
  const exampleData: ExampleData = data.query.addParams?.data || {};
  const onPost = async (formData: any) => {
    const body = {
      ID: "JSON",
      name: data.name,
      exampleName: exampleData.apiName,
      summary: exampleData.summary,
      description: exampleData.description,
      exampleValue: formData,
    };
    await postData(data.path, body);
    await data.query.getData();
    setIsOpen(false);
  };
  return (
    <JsonField
      onSubmit={onPost}
      DefaultCode={JSON.stringify(defaultValues, null, 2)}
    />
  );
}
