import React, { useState, useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function JsonField({
  readOnly = false,
  DefaultCode = JSON.stringify({ example: "data" }, null, 2),
  lang = "json",
  onSubmit,
}: {
  readOnly?: boolean;
  DefaultCode?: string;
  lang?: string;
  onSubmit: (code: string) => Promise<any>;
}) {
  // State for storing the code
  const [code, setCode] = useState(DefaultCode);
  const editorRef = useRef<any>(null);
  // Function to handle code changes
  function handleEditorChange(value: any, event: any) {
    setCode(value);
  }
  async function handleButton(event: any) {
    if (readOnly) {
      navigator.clipboard.writeText(code);
      toast("Copied successfully");
      await onSubmit(code);
    } else {
      console.log(code);
      await onSubmit(code);
    }
  }
  function validateJson(jsonString: string) {
    if (lang !== "json") return true;
    try {
      JSON.parse(jsonString);
      return true;
    } catch (error) {
      return false;
    }
  }
  return (
    <div
      className="w-full h-full mt-4 border border-gray-500"
      onKeyDown={(e) => e.stopPropagation()}
    >
      <Editor
        height="70vh" // set editor height
        defaultLanguage={lang} // specify the language
        defaultValue={code} // set the initial value
        onChange={handleEditorChange} // handle changes
        options={{
          // theme: "vs-dark",
          automaticLayout: true,
          fontSize: 18,
          formatOnPaste: true,
          formatOnType: true,
          readOnly: readOnly,
        }}
      />
      <button
        disabled={!validateJson(code)}
        onClick={handleButton}
        className={`mt-2 px-4 py-2 font-mono font-semibold shadow-lg transition duration-300 ease-linear transform
        ${
          validateJson(code)
            ? "bg-gray-800 hover:bg-gray-900 hover:scale-105 text-white"
            : "bg-gray-600 text-gray-400 cursor-not-allowed"
        }`}
      >
        {readOnly ? "Copy" : "Submit"}
      </button>
    </div>
  );
}

export default JsonField;
