import { useContext, useState } from "react";
import { Editable } from "../file-structure";
import {
  AttributeFileID,
  AttributeFolderID,
  CompFolderID,
  sessionID,
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
      const p = {
        sessionID: sessionID,
        editableID: data.registerID,
        editableName: data.name,
      };
      console.log(p, body);
      // const response = await postData(p, body);
      loadData.FetchData();
      setIsOpen(false);
      // console.log("response", response);
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
          <AddInComponent
            data={data}
            register={register}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            options={[AttributeFileID]}
          />
        );
      }
      case AttributeFileID: {
        return (
          <AddRowForm
            data={data}
            register={register}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
          />
        );
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
  const GetFolderName = (id: string) => {
    switch (id) {
      case AttributeFolderID:
        return "attributes";
      default:
        return "";
    }
  };
  return (
    <form
      onSubmit={handleSubmit((formData: any) => onSubmit(data, formData))}
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

function AddRowForm({ data, register, handleSubmit, onSubmit }: any) {
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
      </div>
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
          rows="3"
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
