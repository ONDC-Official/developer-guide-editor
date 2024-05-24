import { FieldValues } from "react-hook-form";
import { FormFacProps } from "./form-factory";
import { getData, postData } from "../../utils/requestUtils";
import GenericForm from "./generic-form";
import { TagFileID } from "../../pages/home-page";
import FormSelect from "./form-select";
import {FormInput} from "./form-input";
import AutoCompleteInput, { AutoCompleteOption } from "./auto-complete-input";
import { useContext, useEffect, useState } from "react";
import { DataContext } from "../../context/dataContext";
import { Tag, TagData } from "../tag-content";

export function TagFolderForm({ data, setIsOpen, editState }: FormFacProps) {
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
        <FormSelect name="ID" label="Type" options={[TagFileID]} />
        <FormInput name="name" label="Domain" strip={true} />
      </GenericForm>
    </>
  );
}

export function TagApiForm({ data, setIsOpen, editState }: FormFacProps) {
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

export function TagPathForm({ data, setIsOpen, editState }: FormFacProps) {
  const [options, setOptions] = useState<AutoCompleteOption[]>([]);
  const dataContext = useContext(DataContext);

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

  async function OnPost(formData: FieldValues) {
    console.log("Data submitted for attributes:", formData);
    const body: Record<string, any> = {};
    body[data.name] = [{ path: formData.path, tag: [] }];
    await postData(data.path, body);
    data.query.getData();
    setIsOpen(false);
  }

  return (
    <GenericForm
      onSubmit={OnPost}
      className="w-full mx-auto my-4 p-4 border rounded-lg shadow-blue-500"
    >
      <AutoCompleteInput
        register={() => {}}
        options={options}
        name="path"
        label="Path"
      />
    </GenericForm>
  );
}

export function TagGroupForm({ data, setIsOpen, editState }: FormFacProps) {
  const onSubmit = async (formData: Record<string, string>) => {
    console.log("Data submitted for attributes:", formData);
    const tag: Tag[] = [];
    tag.push({
      code: formData.code,
      description: formData.description,
      required: formData.required,
      list: [],
    });
    const body: Record<string, TagData[]> = {};
    body[data.query.addParams?.apiName ?? "API"] = [
      { path: data.query.addParams?.tagPath, tag: tag },
    ];
    await postData(data.path, body);
    await data.query.getData();
    setIsOpen(false);
  };
  return (
    <GenericForm
      onSubmit={onSubmit}
      className="w-full mx-auto my-4 p-4 border rounded-lg shadow-blue-500"
    >
      <FormInput name="code" label="TAG-GROUP CODE:" />
      <FormInput name="description" label="TAG-GROUP DESCRIPTION:" />
      <FormSelect
        name="required"
        label="REQUIRED:"
        options={["Required", "Optional"]}
      />
    </GenericForm>
  );
}

export function TagCodesForm({ data, setIsOpen, editState }: FormFacProps) {
  const onSubmit = async (formData: Record<string, any>) => {
    console.log("Data submitted for attributes:", formData);
    const body: Record<string, TagData[]> = {};
    body[data.query.addParams?.apiName ?? "API"] = [
      {
        path: data.query.addParams?.tagPath,
        tag: [
          {
            code: formData.code,
            description: formData.description,
            required: formData.required,
            list: [],
          },
        ],
      },
    ];
    const tagSet = new Set();
    if (tagNum < 1) {
      alert("At least one enum is required");
      return;
    }
    for (let i = 0; i < tagNum; i++) {
      const tagData = formData[`tag${i}`].split("::");
      if (tagData.length !== 2) {
        alert(`Invalid tag format ${tagData}`);
        return;
      }
      const code = tagData[0].trim().replaceAll(" ", "_");
      const description = tagData[1].trim();
      if (tagSet.has(code)) {
        alert(`Duplicate tag code ${tagData[0]}`);
        return;
      }
      tagSet.add(code);
      body[data.query.addParams?.apiName ?? "API"][0].tag[0].list.push({
        code: code,
        description: description,
      });
    }
    await postData(data.path, body);
    await data.query.getData();
    setIsOpen(false);
  };
  const [tagNum, setTagNum] = useState(
    data.query.updateParams?.tags?.length || 1
  );

  const defaultValues: Record<string, any> = {};
  defaultValues["code"] = data.query.addParams?.tagCode;
  defaultValues["description"] = data.query.addParams?.tagDescription;
  defaultValues["required"] = data.query.addParams?.tagRequired;
  if (data.query.updateParams?.tags) {
    data.query.updateParams.tags.forEach((tag: any, index: number) => {
      defaultValues[`tag${index}`] = `${tag.code} :: ${tag.description}`;
    });
  }

  return (
    <>
      <GenericForm
        onSubmit={onSubmit}
        className="w-full mx-auto my-4 p-4 border rounded-lg shadow-blue-500"
        defaultValues={defaultValues}
      >
        <FormInput name="code" label="TAG GROUP CODE:" required={true} />
        <FormInput
          name="description"
          label="TAG GROUP DESCRIPTION:"
          required={true}
        />
        <FormSelect
          name="required"
          label="REQUIRED:"
          options={["Required", "Optional"]}
        />
        {Array.from({ length: tagNum }).map((_, index) => (
          <FormInput
            key={index}
            name={`tag${index}`}
            label={`Code :: Description`}
            strip={false}
          />
        ))}
      </GenericForm>
      <div className="flex space-x-4 my-4 ml-2">
        <button
          onClick={() => setTagNum(tagNum + 1)}
          className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1"
        >
          Add TAG
        </button>
        <button
          onClick={() => setTagNum(tagNum - 1)}
          className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold  shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1"
        >
          Remove TAG
        </button>
      </div>
    </>
  );
}
