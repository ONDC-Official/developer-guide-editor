import React from "react";
import GenericForm from "./generic-form";
import FormInput from "./form-input";
import FormSelect from "./form-select";
import { Editable } from "../file-structure";
import { FieldValues } from "react-hook-form";
import {
  AttributeFolderID,
  EnumFolderID,
  ExampleFolderID,
  TagFolderID,
} from "../../pages/home-page";
import { postData } from "../../utils/requestUtils";

const AddInComponent = ({
  data,
  setIsOpen,
}: {
  data: Editable;
  setIsOpen: any;
}) => {
  const onSubmit = async (formData: FieldValues) => {
    console.log("Data submitted:", formData);
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
        label="Select Type"
        options={[
          AttributeFolderID,
          EnumFolderID,
          TagFolderID,
          ExampleFolderID,
        ]}
      />
    </GenericForm>
  );
};

export default AddInComponent;
