import { DataContext } from "../context/dataContext";
import React from "react";
import { useForm } from "react-hook-form";
import FolderSelector from "./ui/folder-selector";

function LoadComponent() {
  const dataContext = React.useContext(DataContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any) => {
    dataContext.activePath.current = data.componentName;
    dataContext.setActivePath(data.componentName);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Enter the name of the component to load:
          </label>
          <input
            type="text"
            {...register("componentName", { required: true })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Component name"
          />
          {errors.componentName && (
            <span className="text-red-500 text-xs italic">
              Component name is required.
            </span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Load
          </button>
        </div>
      </form>

      <div>
        <h1>OR you can select a folder to load components from</h1>
        <FolderSelector afterUpload={onSubmit} />
      </div>
    </div>
  );
}

export default LoadComponent;
