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
  return (
    <form onSubmit={handleSubmit(onSubmit)} className={className}>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, { register, errors });
      })}
      <button
        type="submit"
        className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Submit
      </button>
    </form>
  );
};

export default GenericForm;
