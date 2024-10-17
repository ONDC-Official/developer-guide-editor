import { patchData, postData } from "../../../utils/requestUtils";
import { Editable } from "../../file-structure";
import { FormInput, FormTextInput } from "../form-input";
import GenericForm from "../generic-form";
import { FieldValues } from "react-hook-form";

export function TlcForm({
  data,
  setIsOpen,
  editState,
}: {
  data: Editable;
  setIsOpen: any;
  editState: boolean;
}) {
  const defaultValues = data.query.updateParams?.data ?? {};
  const onPost = async (formData: FieldValues) => {
    console.log("Data submitted for attributes:", formData);
    const formatted = {
      ID: "TLC",
      name: "tlc",
      rows: [{ ...formData }],
    };
    await postData(data.path, formatted);
    await data.query?.getData();
    setIsOpen(false);
  };
  const onPatch = async (formData: FieldValues) => {
    console.log("Data submitted for attributes:", formData);
    const formatted = {
      oldName: "tlc",
      newName: "tlc",
      rows: [{ ...formData }],
    };
    await patchData(data.path, formatted);
    await data.query?.getData();
    setIsOpen(false);
  };
  const onSubmit = editState ? onPatch : onPost;
  return (
    <>
      <GenericForm
        onSubmit={onSubmit}
        defaultValues={defaultValues}
        className="w-full mx-auto my-4 p-4 border rounded-lg shadow-blue-500"
      >
        <FormInput
          name="Term"
          label="Term"
          required={true}
          disable={editState}
        />
        <FormInput name="Api" label="Api" required={true} />
        <FormInput name="Attribute" label="Attribute" required={true} />
        <FormInput name="Owner" label="Owner" required={true} />
        <FormInput name="Value" label="Value" required={true} />
        <FormTextInput name="Description" label="Description" required={true} />
      </GenericForm>
    </>
  );
}
