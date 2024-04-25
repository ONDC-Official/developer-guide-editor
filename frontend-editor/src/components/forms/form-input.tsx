const FormInput = ({
  register,
  name,
  label,
  required,
  errors,
  type = "text",
}: any) => (
  <div className="mb-4">
    <label className="block">{label}</label>
    <input
      {...register(name, { required })}
      type={type}
      className="mt-2 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
    />
    {errors[name] && (
      <p className="text-red-500">{errors[name].message || "Required"}</p>
    )}
  </div>
);

export default FormInput;
