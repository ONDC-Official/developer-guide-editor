import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import LoadingButton from "../ui/loadingButton";

const GenericForm = ({
  defaultValues,
  children,
  onSubmit,
  className,
}: {
  defaultValues?: any;
  children: any;
  onSubmit: any;
  className?: string;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  const handleFocus = (e: any) => {
    e.stopPropagation();
  };

  // Prevent form submission on Enter key press
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Enter" && e.target instanceof HTMLInputElement) {
        e.preventDefault();
      }
    };

    document.addEventListener("keypress", handleKeyPress);

    return () => {
      document.removeEventListener("keypress", handleKeyPress);
    };
  }, []);

  return (
    <>
      <form
        onFocus={handleFocus}
        onSubmit={handleSubmit(onSubmit)}
        className={className}
      >
        {React.Children.map(children, (child) => {
          return React.cloneElement(child, { register, errors });
        })}
      </form>
      <LoadingButton onClick={handleSubmit(onSubmit)} buttonText="Submit" />
    </>
  );
};

export default GenericForm;
