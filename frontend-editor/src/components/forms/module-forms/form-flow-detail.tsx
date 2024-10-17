import React, { useState } from "react";
import { FormFacProps } from "../form-factory";
import GenericForm from "../generic-form";
import { FormInput, FormTextInput } from "../form-input";
import { patchData } from "../../../utils/requestUtils";
import { toast } from "react-toastify";
import { MermaidDiagram } from "../../ui/mermaid";
import { Transition } from "@headlessui/react";

const FormFlowDetail = ({ data, setIsOpen }: FormFacProps) => {
  let defaultValue: any = {};
  const [detailMermaidPreview, setDetailMermaidPreview] = useState(false);
  const [mermaidInputValue, setMermaidInputValue] = useState("");
  if (
    data.query.updateParams &&
    data.query.updateParams?.type === "edit" &&
    data.query.updateParams?.data?.length
  ) {
    const detail =
      data.query.updateParams?.data[data.query.updateParams?.index];

    defaultValue = {
      description: detail?.description,
      mermaid: mermaidInputValue ? mermaidInputValue : detail?.mermaid,
    };
  }

  const onSubmit = async (formData: Record<string, string>) => {
    let updatedPayload = [];

    if (!formData?.description) {
      toast.error("description needed");
      return;
    }

    if (!formData?.mermaid) {
      toast.error("mermaid needed");
      return;
    }

    if (
      data.query.updateParams &&
      data.query.updateParams?.type === "edit" &&
      data.query.updateParams?.data?.length
    ) {
      updatedPayload = data.query.updateParams?.data;
      updatedPayload[data.query.updateParams?.index] = formData;
    } else if (
      data.query.updateParams &&
      data.query.updateParams?.type === "new"
    ) {
      updatedPayload = data.query.updateParams?.data;
      updatedPayload.push(formData);
    }

    try {
      await patchData(data.path, {
        details: updatedPayload,
      });
      await data.query.getData();
      setIsOpen(false);
    } catch (error) {
      console.log({ error });
      setIsOpen(false);
    }
  };

  function handledetailMermaidPreviewButtonClick() {
    setDetailMermaidPreview(!detailMermaidPreview);
  }
  const handleInputChange = (e: any) => {
    setMermaidInputValue(e.target.value);
  };

  return (
    <div>
      {!detailMermaidPreview && (
        <Transition.Child
          enter="ease-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <GenericForm
            onSubmit={onSubmit}
            className="w-full mx-auto my-4 p-4 border rounded-lg shadow-blue-500"
            defaultValues={defaultValue}
          >
            <FormInput
              name={`description`}
              label={`Description`}
              strip={false}
            />
            <FormTextInput
              onChange={handleInputChange}
              name={`mermaid`}
              label={`Mermaid`}
              strip={false}
            />
            <button
              type="button"
              onClick={handledetailMermaidPreviewButtonClick}
              className="bottom-8 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1"
            >
              Mermaid Preview
            </button>
          </GenericForm>
        </Transition.Child>
      )}
      {detailMermaidPreview && (
        <Transition.Child
          enter="ease-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <button
            type="button"
            onClick={handledetailMermaidPreviewButtonClick}
            className="bottom-8 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1"
          >
            Back
          </button>
          <MermaidDiagram chartDefinition={defaultValue?.mermaid} keys={""} />
        </Transition.Child>
      )}
    </div>
  );
};

export default FormFlowDetail;
