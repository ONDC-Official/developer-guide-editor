import { useContext, useState } from "react";
import { Editable } from "../file-structure";
import {
  AttributeFileID,
  AttributeFolderID,
  CompFolderID,
} from "../../pages/home-page";
import { useForm } from "react-hook-form";
import { postData } from "../../utils/requestUtils";
import { DataContext } from "../../context/dataContext";
import { watch } from "fs";

export function FormFactory({
  data,
  setIsOpen,
}: {
  data: Editable;
  setIsOpen: any;
}) {
  const { register, handleSubmit, watch } = useForm();
  const loadData = useContext(DataContext);
  const [errorTxt, setError] = useState("");
  const onSubmit = async (params: any, body: any) => {
    try {
      console.log("POSTING", data.path, body);
      console.log(data);
      await postData(data.path, body);
      loadData.FetchData();
      setIsOpen(false);
    } catch (error: any) {
      console.log("error", error);
      setError(error.message);
    }
  };
  const Error = () => <div className="text-red-500 mt-2">{errorTxt}</div>;
  function GenerateFunction() {
    switch (data.registerID) {
      case CompFolderID: {
        return (
          <AddInComponent
            data={data}
            register={register}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            options={[AttributeFolderID]}
            watch={watch}
          />
        );
      }
      case AttributeFolderID: {
        return (
          <AddInAttributes
            data={data}
            register={register}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            options={[AttributeFileID]}
            watch={watch}
          />
        );
      }
      case AttributeFileID: {
        if (data.query?.type === "addRow") {
          return <AddRowForm data={data} setIsOpen={setIsOpen} />;
        }
        return <AddSheet data={data} setIsOpen={setIsOpen} />;
      }
      default: {
        return <></>;
      }
    }
  }
  return (
    <>
      <GenerateFunction />
      <Error />
    </>
  );
}

function AddInComponent({
  data,
  register,
  handleSubmit,
  onSubmit,
  options,
  watch,
}: any) {
  const dataContext = useContext(DataContext);
  return (
    <form
      onSubmit={handleSubmit((formData: any) => {
        onSubmit(data, formData);
      })}
      className=" w-full mx-auto my-4 p-4 border rounded-lg shadow-blue-500"
    >
      <div className="mb-4">
        <label className="block">Select Type</label>
        <select
          {...register("ID")}
          className="mt-2 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
        >
          {options.map((option: any) => (
            <option value={option} key={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <input
        type="submit"
        value="Submit"
        className="mt-3 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded cursor-pointer shadow-lg hover:shadow-xl transition duration-150 ease-in-out"
      />
    </form>
  );
}

function AddInAttributes({
  data,
  register,
  handleSubmit,
  onSubmit,
  options,
  watch,
}: any) {
  return (
    <form
      onSubmit={handleSubmit((formData: any) => {
        onSubmit(data, formData);
      })}
      className=" w-full mx-auto my-4 p-4 border rounded-lg shadow-blue-500"
    >
      <div className="mb-4">
        <label className="block">Select Type</label>
        <select
          {...register("ID")}
          className="mt-2 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
        >
          {options.map((option: any) => (
            <option value={option} key={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block">Attribute Name</label>
        <input
          {...register("name")}
          type="text"
          className="mt-2 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          required
        />
      </div>
      <input
        type="submit"
        value="Submit"
        className="mt-3 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded cursor-pointer shadow-lg hover:shadow-xl transition duration-150 ease-in-out"
      />
    </form>
  );
}

function AddRowForm({
  data,
  setIsOpen,
}: {
  data: Editable;
  setIsOpen: (open: boolean) => void;
}) {
  // Setup default values if rowData exists
  const defaultValues = data.query.rowData
    ? {
        path: data.query.rowData.path,
        required: data.query.rowData.required,
        type: data.query.rowData.type,
        owner: data.query.rowData.owner,
        usage: data.query.rowData.usage,
        description: data.query.rowData.description,
      }
    : {};

  // Initialize useForm hook with default values
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  // Define the function to call on form submission
  const onSubmit = async (formData: any) => {
    const path = data.path;
    const body = {
      sheetName: data.query.sheet,
      attributes: [formData],
    };
    console.log("POSTING", path, body);
    await postData(path, body);
    setIsOpen(false);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full mx-auto my-4 p-4 border rounded-lg shadow-blue-500"
    >
      <div className="mb-4">
        <label className="block">Path</label>
        <input
          {...register("path")}
          type="text"
          className="mt-2 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block">Required</label>
        <select
          {...register("required")}
          className="mt-2 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          required
        >
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block">Type</label>
        <input
          {...register("type")}
          type="text"
          className="mt-2 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block">Owner</label>
        <input
          {...register("owner")}
          type="text"
          className="mt-2 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
        />
      </div>

      <div className="mb-4">
        <label className="block">Usage</label>
        <input
          {...register("usage")}
          type="text"
          className="mt-2 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
        />
      </div>

      <div className="mb-4">
        <label className="block">Description</label>
        <textarea
          {...register("description")}
          className="mt-2 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
        />
      </div>

      <button
        type="submit"
        className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Submit
      </button>
    </form>
  );
}

function AddSheet({ data, setIsOpen }: { data: Editable; setIsOpen: any }) {
  // Initialize useForm hook
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Define the function to call on form submission
  const onSubmit = async (data: Editable, formData: any) => {
    const path = data.path;
    const body = {
      sheetName: formData.sheet,
    };
    console.log("POSTING", path, body);
    await postData(path, body);
    setIsOpen(false);
  };
  return (
    <form
      onSubmit={handleSubmit((formData: any) => onSubmit(data, formData))}
      className="w-full mx-auto my-4 p-4 border rounded-lg shadow-blue-500"
    >
      <div className="mb-4">
        <label className="block">sheet</label>
        <input
          {...register("sheet")}
          type="text"
          className="mt-2 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          required
        />
        <input
          type="submit"
          value="Submit"
          className="mt-3 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded cursor-pointer shadow-lg hover:shadow-xl transition duration-150 ease-in-out"
        />
      </div>
    </form>
  );
}
