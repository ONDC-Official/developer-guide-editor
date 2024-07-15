import Tippy from "@tippyjs/react";
import React from "react";
import { GoInfo } from "react-icons/go";
import "tippy.js/animations/perspective-subtle.css";

const FormInput = ({
  register,
  name,
  label,
  errors,
  required = true,
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
      <LabelWithToolTip labelInfo={labelInfo} label={label} />
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
  onChange,
  labelInfo = "",
}: any) => {
  const handleChange = (e: any) => {
    let value = e.target.value;
    if (strip) {
      // Replace all spaces globally
      value = value.replace(/\s+/g, "");
    }
    e.target.value = value; // Set the input field's value
    onChange && onChange(e);
  };
  const handleFocus = (e: any) => {
    e.stopPropagation();
  };

  return (
    <div className="mb-4">
      <LabelWithToolTip labelInfo={labelInfo} label={label} />
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

export function LabelWithToolTip({
  label,
  labelInfo,
}: {
  label: string;
  labelInfo: string;
}) {
  return (
    <div className="flex items-center justify-between w-full">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {labelInfo != "" && (
        <Tippy
          content={<LabelToolTip label={labelInfo} />}
          placement="right-start"
          animation="perspective-subtle"
          interactive={true}
        >
          <label className="text-sm font-medium text-gray-700">
            <GoInfo size={22} className="text-black" />
          </label>
        </Tippy>
      )}
    </div>
  );
}

export function LabelToolTip({ label }: { label: string }) {
  const formattedLabelInfo = label.split("\n").map((line, index) => (
    <React.Fragment key={index}>
      {line}
      <br />
    </React.Fragment>
  ));
  return (
    <>
      <div className="relative p-2 pr-8 max-w-xs  shadow-lg bg-blue-50  backdrop-blur-lg text-white text-sm font-semibold text-center border border-white/20">
        <div className="absolute top-2 left-2">
          {/* <IoInformationCircle size={20} className="text-black" /> */}
        </div>
        <h1 className="text-black mb-1 ml-3">{formattedLabelInfo}</h1>
      </div>
    </>
  );
}
