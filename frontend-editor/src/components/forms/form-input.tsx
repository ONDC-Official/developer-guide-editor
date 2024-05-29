import Tippy from "@tippyjs/react";
import React from "react";
import { IoInformation, IoInformationCircle } from "react-icons/io5";

const FormInput = ({
  register,
  name,
  label,
  required,
  errors,
  type = "text",
  strip = false,
  disable = false,
  labelInfo = "",
}: any) => {
  const handleChange = (e: any) => {
    let value = e.target.value;
    if (strip) {
      // Replace all spaces globally
      value = value.replace(/\s+/g, "");
    }
    e.target.value = value; // Set the input field's value
  };
  const handleFocus = (e: any) => {
    e.stopPropagation();
  };

  return (
    <div className="mb-4">
      <Tippy
        content={<LabelToolTip label={labelInfo} />}
        placement="left-start"
      >
        <label htmlFor={name} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      </Tippy>
      <input
        onFocus={handleFocus}
        {...register(name, { required })}
        disabled={disable}
        id={name}
        type={type}
        className="mt-2 block w-full p-2 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
        onChange={handleChange} // Apply custom onChange to handle value transformation
        onKeyDown={(e) => {
          e.stopPropagation();
        }}
      />
      {errors[name] && (
        <p className="text-red-500 text-xs italic">
          {errors[name].message || "This field is required"}
        </p>
      )}
    </div>
  );
};

const FormTextInput = ({
  register,
  name,
  label,
  required,
  errors,
  type = "text",
  rols = 10,
  cols = 100,
  strip = false,
  disable = false,
  labelInfo = "",
}: any) => {
  const handleChange = (e: any) => {
    let value = e.target.value;
    if (strip) {
      // Replace all spaces globally
      value = value.replace(/\s+/g, "");
    }
    e.target.value = value; // Set the input field's value
  };
  const handleFocus = (e: any) => {
    e.stopPropagation();
  };

  return (
    <div className="mb-4">
      <Tippy
        content={<LabelToolTip label={labelInfo} />}
        placement="left-start"
      >
        <label htmlFor={name} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      </Tippy>
      <textarea
        onFocus={handleFocus}
        {...register(name, { required })}
        disabled={disable}
        id={name}
        type={type}
        rows={10}
        cols={100}
        className="mt-2 block w-full p-2 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
        onChange={handleChange} // Apply custom onChange to handle value transformation
        onKeyDown={(e) => {
          e.stopPropagation();
        }}
      />
      {errors[name] && (
        <p className="text-red-500 text-xs italic">
          {errors[name].message || "This field is required"}
        </p>
      )}
    </div>
  );
};

export { FormInput, FormTextInput };

export function LabelToolTip({ label }: { label: string }) {
  return (
    <>
      <div className="relative p-2 pr-8 max-w-xs rounded-lg shadow-lg bg-white/30 backdrop-blur-lg text-white text-sm font-semibold text-center border border-white/20">
        <div className="absolute top-2 right-2">
          <IoInformationCircle size={20} className="text-black" />
        </div>
        <h1 className="text-black mb-1">{label}</h1>
      </div>
    </>
  );
}
