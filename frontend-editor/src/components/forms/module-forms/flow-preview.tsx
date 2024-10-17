import React, { useState, useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function FlowPreview({
  readOnly = true,
  DefaultCode = JSON.stringify({ example: "data" }, null, 2),
}: {
  readOnly?: boolean;
  DefaultCode?: string;
}) {
  // State for storing the code
  const [code, setCode] = useState(DefaultCode);

  // Function to handle code changes
  function handleEditorChange(value: any, event: any) {
    setCode(value);
  }
  return (
    <>
      <div className="w-full h-full mt-4 border border-gray-500">
        <Editor
          height="70vh" // set editor height
          defaultLanguage="json" // specify the language
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
      </div>
    </>
  );
}

export default FlowPreview;
