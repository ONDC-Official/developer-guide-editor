import { on } from "events";
import { Editable } from "../../file-structure";
import GenericForm from "../generic-form";
import FormSelect from "../form-select";
import { FormInput } from "../form-input";
import { getData, patchData, postData } from "../../../utils/requestUtils";
import { ExampleData } from "../../example-content";
import JsonField from "../JsonField";
import { ExampleFolderID } from "../../../pages/home-page";

interface NewExample {
  ID: string; // use ID to determine FORM or JSON
  name: string; // api folder name
  exampleName: string; // api inside api folder
  summary: string;
  description: string;
  exampleValue: Record<string, any> | string; // html code or json
}

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
    const example: NewExample = {
      ID: formData.ExampleType,
      name: formData.name,
      summary: formData.summary,
      description: formData.description,
      exampleName: "",
      exampleValue:
        formData.ExampleType === "JSON"
          ? { Dummy: "ADD NEW EXAMPLE!" }
          : `<!DOCTYPE html>
          <html lang="en">
          
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Buyer Details</title>
          </head>
          
          <body>
              <h1> add form html here</h1>
          </body>
          
          </html>`,
    };
    body.examples = {};
    body.examples[formData.name] = [example];
    await postData(data.path ?? "", body);
    await data.query?.getData();
    setIsOpen(false);
  }
  const defaultValues: Record<string, any> = {};
  if (data.query.addParams?.apiCat) {
    defaultValues["name"] = data.query.addParams.apiCat;
  }
  async function onPatch(formData: any) {
    const body: Record<string, any> = {};
    body.ID = ExampleFolderID;
    body.oldName = data.name;
    body.newName = formData.name;
    body.summary = formData.summary;
    body.description = formData.description;
    const path = `${data.query.Parent?.path}/examples`;
    await patchData(path, body);
    await data.query?.getData();
    setIsOpen(false);
  }
  if (editState) {
    const defVals = {
      summary: data.query.updateParams?.summary,
      description: data.query.updateParams?.description,
      name: data.name,
    };

    return (
      <GenericForm
        onSubmit={onPatch}
        defaultValues={defVals}
        className="w-full mx-auto my-4 p-4 border rounded-lg shadow-blue-500"
      >
        <FormInput name="name" label="Domain Name" required={true} />
        <FormInput name="summary" label="Summary" required={true} />
        <FormInput name="description" label="Description" required={true} />
      </GenericForm>
    );
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
        {/* <FormInput
          name="exampleName"
          label="Enter Example Name"
          strip={true}
          required={true}
        /> */}
        <FormInput name="summary" label="Summary" strip={true} />
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
      examples: {
        [data.name]: [
          {
            ID: "JSON",
            name: data.name,
            // exampleName: exampleData.apiName,
            summary: exampleData.summary,
            description: exampleData.description,
            exampleValue: formData,
          },
        ],
      },
    };
    console.log(body);
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

export function EditExampleCategoryForm({
  data,
  setIsOpen,
  editState,
}: {
  data: Editable;
  setIsOpen: any;
  editState: boolean;
}) {
  const defaultValues = {
    name: data.name,
    summary: data.query.updateParams?.summary,
    description: data.query.updateParams?.description,
  };
  const onPost = async (formData: any) => {
    const body = {
      oldName: data.name,
      newName: formData.summary,
      description: formData.description,
      type: "EXAMPLE",
      summary: data.query.updateParams?.summary,
    };
    await patchData(data.path, body);
    await data.query.getData();
    setIsOpen(false);
  };
  return (
    <GenericForm
      onSubmit={onPost}
      defaultValues={defaultValues}
      className="w-full mx-auto my-4 p-4 border rounded-lg shadow-blue-500"
    >
      <FormInput name="summary" label="Summary" required={true} strip={true} />
      <FormInput name="description" label="Description" required={true} />
    </GenericForm>
  );
}

export function EditHtmlForm({
  data,
  setIsOpen,
  editState,
}: {
  data: Editable;
  setIsOpen: any;
  editState: boolean;
}) {
  async function onPost(FormData: any) {
    let summary = data.name.split("_").slice(1).join(" ");
    const body = {
      examples: {
        form: [
          {
            ID: "FORM",
            name: "form",
            exampleName: data.name,
            summary: data.name,
            exampleValue: FormData,
          },
        ],
      },
    };
    await postData(data.path, body);
    console.log(data.query.getData);
    await data.query.getData();
    setIsOpen(false);
  }

  return (
    <JsonField
      DefaultCode={data.query.addParams?.exampleData}
      onSubmit={onPost}
      lang="html"
    />
  );
}
