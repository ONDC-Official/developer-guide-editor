import React, { useState, useRef, useEffect } from "react";
import MonacoEditor from "react-monaco-editor";

function JsonField() {
  // State for storing the code
  const [code, setCode] = useState(
    JSON.stringify({ example: "data" }, null, 2)
  );
  const editorRef = useRef(null);

  // Function to handle when the editor is mounted
  const editorDidMount = (editor: any, monaco: any) => {
    editor.focus();
    editorRef.current = editor; // Store editor reference for potential future use
  };

  // Function to handle code changes
  const onChange = (newValue: any, e: any) => {
    console.log("onChange", newValue, e);
    setCode(newValue);
  };

  // Editor options
  const options = {
    selectOnLineNumbers: true,
    readOnly: false,
    automaticLayout: true,
    formatOnPaste: true,
    formatOnType: true,
    fontSize: 18,
  };

  // Component's render method
  return (
    <div className="w-full h-full mt-4">
      <MonacoEditor
        width="600"
        height="600"
        language="json"
        theme="vs-dark"
        value={code}
        options={options}
        onChange={onChange}
        editorDidMount={editorDidMount}
      />
      <button
        onClick={() => console.log(code)}
        className="mt-2 px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white font-mono font-semibold shadow-lg transition duration-300 ease-linear transform hover:scale-105"
      >
        Submit
      </button>
    </div>
  );
}

export default JsonField;
