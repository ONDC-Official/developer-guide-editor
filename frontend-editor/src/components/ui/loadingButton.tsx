import React, { useState } from "react";
import {
  AiOutlineLoading3Quarters,
  AiOutlineCheck,
  AiOutlineClose,
} from "react-icons/ai";
import { toast } from "react-toastify";
import "tailwindcss/tailwind.css";

const LoadingButton = ({
  onClick,
  buttonText,
  disabled = false,
}: {
  onClick: () => Promise<any>;
  buttonText: string;
  disabled?: boolean;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorText, setErrorText] = useState("");
  const handleClick = async () => {
    if (disabled) return;
    setIsLoading(true);
    setIsSuccess(false);
    setIsError(false);
    try {
      await onClick();
      setIsLoading(false);
      setIsSuccess(true);
      toast.success("Success! in " + buttonText);
      //   setTimeout(() => setIsSuccess(false), 2000); // Reset success state after 2 seconds
    } catch (error: any) {
      setIsLoading(false);
      setIsError(true);
      setErrorText(error.message);
      toast.error("Error: in " + buttonText);
      //   setTimeout(() => setIsError(false), 2000); // Reset error state after 2 seconds
    }
  };

  return (
    <button
      disabled={disabled}
      onClick={handleClick}
      className={`flex items-center justify-center px-4 py-2 text-white font-semibold transition-all duration-300 ${
        isSuccess
          ? "bg-green-500 hover:bg-green-600"
          : isError
            ? "bg-red-500 hover:bg-red-600"
            : "bg-blue-500 hover:bg-blue-600"
      }`}
    >
      {isLoading ? (
        <AiOutlineLoading3Quarters className="animate-spin mr-2" />
      ) : isSuccess ? (
        <AiOutlineCheck className="mr-2" />
      ) : isError ? (
        <AiOutlineClose className="mr-2" />
      ) : null}
      {buttonText}
    </button>
  );
};

export default LoadingButton;
