import React, { useContext, useEffect, useState } from "react";
import { Editable } from "../file-structure";
import AutoCompleteInput, { AutoCompleteOption } from "./auto-complete-input";
import FormInput from "./form-input";
import GenericForm from "./generic-form";
import { getData, patchData, postData } from "../../utils/requestUtils";
import { DataContext } from "../../context/dataContext";
import { FormFacProps } from "./form-factory";
import { FieldValues } from "react-hook-form";
import FormSelect from "./form-select";
import { EnumFileId } from "../../pages/home-page";

export function EnumFolderForm({ data, setIsOpen, editState }: FormFacProps) {
  const onPost = async (formData: FieldValues) => {
    console.log("Data submitted for attributes:", formData);
    await postData(data.path, formData);
    await data.query?.getData();
    setIsOpen(false);
  };
  if (editState) {
    return <span>Enum Folder Edit is not currently supported!</span>;
  }
  return (
    <>
      <GenericForm
        onSubmit={onPost}
        className="w-full mx-auto my-4 p-4 border rounded-lg shadow-blue-500"
      >
        <FormSelect name="ID" label="Type" options={[EnumFileId]} />
        <FormInput name="name" label="Domain" strip={true} />
      </GenericForm>
    </>
  );
}

export function EnumForm({
  data,
  setIsOpen,
  editState,
}: {
  data: Editable;
  setIsOpen: any;
  editState: boolean;
}) {
  const onPost = async (formData: Record<string, string>) => {
    const body: Record<string, any> = {};
    const name = editState ? data.query.Parent?.name ?? data.name : data.name;
    body[name] = [
      {
        path: defaultValues.path ? defaultValues.path : formData.path,
        enums: [],
      },
    ];
    const enumSet = new Set();
    if (enumNumber < 1) {
      alert("At least one enum is required");
      return;
    }
    for (let i = 0; i < enumNumber; i++) {
      const enumData = formData[`enum${i}`].split("::");

      if (enumData.length !== 2) {
        alert(`Invalid enum format ${enumData}`);
        return;
      }
      const code = enumData[0].trim().replaceAll(" ", "_");
      const description = enumData[1].trim();
      if (enumSet.has(code)) {
        alert(`Duplicate enum code ${enumData[0]}`);
        return;
      }
      enumSet.add(code);
      body[name][0].enums.push({
        code: code,
        description: description,
      });
    }
    await postData(data.path, body);
    await data.query.getData();
    setIsOpen(false);
  };
  const [options, setOptions] = useState<AutoCompleteOption[]>([]);
  const dataContext = useContext(DataContext);
  const [enumNumber, setEnumNumber] = useState(
    data.query.updateParams?.enums?.length || 1
  );
  const defaultValues: Record<string, any> = {};
  if (data.query.updateParams && !data.query.updateParams.oldName) {
    console.log(data.query.updateParams);
    defaultValues["path"] = data.query.updateParams.path;
    data.query.updateParams.enums.forEach((item: any, index: number) => {
      defaultValues[`enum${index}`] = `${item.code} :: ${item.description}`;
    });
  }

  useEffect(() => {
    const fetchOptions = async () => {
      const fetched = await getData(
        dataContext.activePath.current + "/attributes",
        { type: "pathSet" }
      );
      const mappedArray = fetched.map((item: any, index: number) => {
        return { id: index, value: item };
      });
      setOptions(mappedArray);
    };
    fetchOptions();
  }, []);

  const onPatch = async (formData: Record<string, string>) => {
    let body: Record<string, any> = {};
    body = {
      newName: formData.newName,
      oldName: data.name,
    };
    await patchData(data.path, body);
    await data.query.getData();
    setIsOpen(false);
  };
  if (editState && data.query.updateParams?.oldName) {
    return (
      <GenericForm
        onSubmit={onPatch}
        className="w-full mx-auto my-4 p-4 border rounded-lg shadow-blue-500"
      >
        <FormInput
          name="newName"
          label={`Rename: ${data.name}`}
          required={true}
        />
      </GenericForm>
    );
  }

  return (
    <>
      <GenericForm
        onSubmit={onPost}
        className="w-full mx-auto my-4 p-4 border rounded-lg shadow-blue-500"
        defaultValues={defaultValues}
      >
        {!editState ? (
          <AutoCompleteInput
            register={() => {}}
            options={options}
            name="path"
            label="Path"
          />
        ) : (
          <></>
        )}
        {Array.from({ length: enumNumber }).map((_, index) => (
          <FormInput
            key={index}
            name={`enum${index}`}
            label={`Code :: Description`}
            strip={false}
          />
        ))}
      </GenericForm>
      <div className="flex space-x-4 my-4 ml-2">
        <button
          onClick={() => setEnumNumber(enumNumber + 1)}
          className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1"
        >
          Add Enum
        </button>
        <button
          onClick={() => setEnumNumber(enumNumber - 1)}
          className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold  shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1"
        >
          Remove Enum
        </button>
      </div>
    </>
  );
}

export function EnumApiForm({
  data,
  setIsOpen,
  editState,
}: {
  data: Editable;
  setIsOpen: any;
  editState: boolean;
}) {
  const onSubmit = async (formData: Record<string, string>) => {
    const body: Record<string, any> = {};
    body[formData.api] = [];
    console.log(body);
    await postData(data.path, body);
    await data.query.getData();
    console.log(data);
    setIsOpen(false);
  };

  return (
    <GenericForm
      onSubmit={onSubmit}
      className="w-full mx-auto my-4 p-4 border rounded-lg shadow-blue-500"
    >
      <FormInput name="api" label="API name" />
    </GenericForm>
  );
}
