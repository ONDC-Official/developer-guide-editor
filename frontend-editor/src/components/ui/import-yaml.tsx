import React, { useContext, useRef } from "react";
import axios from "axios";
import yaml from "js-yaml";
import { BiImport } from "react-icons/bi";
import { DataContext } from "../../context/dataContext";
import { postData } from "../../utils/requestUtils";
import { toast } from "react-toastify";

const ImportYamlButton: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const dataContext = useContext(DataContext);
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event: ProgressEvent<FileReader>) => {
      try {
        dataContext.setLoading(true);
        const yamlText = event.target?.result as string;
        const jsonData = yaml.load(yamlText);
        const response = await postData("components", {
          build: jsonData,
        });
        console.log("Response from POST request:", response);
        dataContext.setLoading(false);
        await dataContext.components.query.getData();
        toast.success("YAML imported successfully!");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } catch (error) {
        dataContext.setLoading(false);
        toast.error("Error importing YAML file");
        console.error("Error parsing YAML or sending POST request:", error);
      }
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <input
        type="file"
        accept=".yaml, .yml"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <button
        onClick={handleImport}
        className="flex items-center px-4 py-2 text-fuchsia-600 text-sm font-medium transition duration-200 border-2 border-fuchsia-600 hover:bg-fuchsia-600 hover:text-white"
      >
        <BiImport className="mr-2" size={20} />
        IMPORT
      </button>
    </div>
  );
};

export default ImportYamlButton;
