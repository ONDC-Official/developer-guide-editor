import React, { ChangeEvent, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { DataContext } from "../../context/dataContext";
import FullPageLoader from "../loader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./mini-ui/card";
import { BiUpload } from "react-icons/bi";

interface CustomInputAttributes
  extends React.InputHTMLAttributes<HTMLInputElement> {
  webkitdirectory?: string;
  directory?: string;
}

function FolderSelector({ afterUpload }: { afterUpload: any }) {
  const [loading, setLoading] = React.useState(false);

  const handleFolderSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const filesArray = Array.from(files); // Convert FileList to Array
      const formData = new FormData();
      filesArray.forEach((file) => {
        console.log(file);
        formData.append("files", file, file.webkitRelativePath);
      });

      try {
        setLoading(true);
        localStorage.setItem("repoLink", "-1");
        const response = await axios.post(
          "http://localhost:1000/local/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log(response.data);
        setLoading(false);
        localStorage.setItem(
          "secretKey",
          Math.random().toString(10).substring(2)
        );
        afterUpload({ componentName: "uploads" });
        toast.success("Upload successful!");
      } catch (error: any) {
        console.error("Error uploading files:", error);
        toast.error("Upload failed! " + (error?.message || ""));
        setLoading(false);
      }
    }
  };

  return (
    <Card className="mx-auto max-w-sm bg-white bg-opacity-20 backdrop-blur-md p-6 rounded-lg shadow-lg mt-28">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl md:text-2xl lg:text-2xl font-bold text-transparent bg-clip-text flex-grow bg-blue-500 mb-4">
          Upload
        </CardTitle>
        <CardDescription>
          upload a ondc-specification folder from your machine
        </CardDescription>
      </CardHeader>
      <CardContent>
        <label
          htmlFor="folderUpload"
          className=" cursor-pointer flex-auto w-full bg-blue-500 hover:bg-blue-400 text-white font-semibold py-2 px-4 rounded transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-opacity-50 shadow-md flex items-center justify-center"
        >
          <BiUpload className="mr-2" size={20} />
          Select Folder
          <input
            type="file"
            id="folderUpload"
            onChange={handleFolderSelect}
            {...({
              webkitdirectory: "",
              directory: "",
            } as CustomInputAttributes)}
            className="hidden"
          />
        </label>
      </CardContent>
      <div>{loading && <FullPageLoader />}</div>
    </Card>
  );
}

export default FolderSelector;
