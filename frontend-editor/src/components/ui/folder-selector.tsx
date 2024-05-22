import React, { ChangeEvent, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { DataContext } from "../../context/dataContext";

interface CustomInputAttributes
  extends React.InputHTMLAttributes<HTMLInputElement> {
  webkitdirectory?: string;
  directory?: string;
}

function FolderSelector({ afterUpload }: { afterUpload: any }) {
  const dataContext = useContext(DataContext);

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
        dataContext.setLoading(true);

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
        dataContext.setLoading(false);
        afterUpload({ componentName: "uploads" });
        toast.success("Upload successful!");
      } catch (error: any) {
        console.error("Error uploading files:", error);
        toast.error("Upload failed! " + (error?.message || ""));
        dataContext.setLoading(false);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <label
          htmlFor="folderUpload"
          className="cursor-pointer flex flex-col items-center bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
        >
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
      </div>
    </div>
  );
}

export default FolderSelector;
