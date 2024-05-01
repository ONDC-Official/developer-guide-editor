const FormSelect = ({ register, name, label, options, errors }: any) => (
  <div className="mb-4">
    <label className="block">{label}</label>
    <select
      {...register(name)}
      className="mt-2 block w-full p-2 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
    >
      {options.map((option: string, index: number) => (
        <option value={option} key={index}>
          {option}
        </option>
      ))}
    </select>
    {errors[name] && <p className="text-red-500">{errors[name].message}</p>}
  </div>
);

export default FormSelect;
