export const GlobalEditMode = import.meta.env.VITE_EDIT_MODE === "true";
import { type ClassValue } from "clsx";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export const ToggleLocalEditMode = () => {
  const current = localStorage.getItem("editMode");
  if (current === "true") {
    localStorage.setItem("editMode", "false");
  } else {
    localStorage.setItem("editMode", "true");
  }
  console.log(localStorage.getItem("editMode"));
  //   window.location.reload();
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
