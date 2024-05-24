import React from "react";

const FormSelect = ({
  register,
  name,
  label,
  options,
  errors,
  setSelectedValue,
  defaultValue,
}: any) => {
  const onSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(e.target.value, "index");
    setSelectedValue(e.target.value);
  };
  return (
    <>
      <div className="mb-4">
        <label className="block">{label}</label>
        <select
          {...register(name)}
          className="mt-2 block w-full p-2 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          onChange={onSelectChange}
          defaultValue={defaultValue}
        >
          {options.map((option: string, index: number) => {
            // if default prop is passed it will set defulat value in select
            if (defaultValue === option)
              return (
                <option selected value={option} key={index}>
                  {option}
                </option>
              );
            return (
              <option value={option} key={index}>
                {option}
              </option>
            );
          })}
        </select>
        {errors[name] && <p className="text-red-500">{errors[name].message}</p>}
      </div>
    </>
  );
};

export default FormSelect;
