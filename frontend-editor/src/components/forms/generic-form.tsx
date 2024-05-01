import React from "react";
import { useForm } from "react-hook-form";

const GenericForm = ({
  defaultValues,
  children,
  onSubmit,
  className,
}: {
  defaultValues?: any;
  children: any;
  onSubmit: any;
  className: string;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });
  const handleFocus = (e: any) => {
    e.stopPropagation();
  };
  return (
    <form
      onFocus={handleFocus}
      onSubmit={handleSubmit(onSubmit)}
      className={className}
    >
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, { register, errors });
      })}
      <button
        type="submit"
        className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1"
      >
        Submit
      </button>
    </form>
  );
};

export default GenericForm;
