import React from "react";

const FormInput = ({
  register,
  name,
  label,
  required,
  errors,
  type = "text",
  strip = false,
  disable = false,
}: any) => {
  const handleChange = (e: any) => {
    let value = e.target.value;
    if (strip) {
      // Replace all spaces globally
      value = value.replace(/\s+/g, "");
    }
    e.target.value = value; // Set the input field's value
  };

  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        {...register(name, { required })}
        disabled={disable}
        id={name}
        type={type}
        className="mt-2 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
        onChange={handleChange} // Apply custom onChange to handle value transformation
      />
      {errors[name] && (
        <p className="text-red-500 text-xs italic">
          {errors[name].message || "This field is required"}
        </p>
      )}
    </div>
  );
};

export default FormInput;
