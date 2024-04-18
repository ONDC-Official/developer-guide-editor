import "./App.css";
import React from "react";
import DisplayTable from "./components/attribute-table";
import {
  FileStructureSidebar,
  // FileSystemItem,
  // DirectoryItem,
  // FileItem,
} from "./components/file-structure";
import { OndcTitle } from "./components/title";
import TestButton from "./components/ui/tooltip-text";
// import files from "./files.json";

function App() {
  return (
    <>
      <OndcTitle />
      <div className="flex w-full h-full overflow-hidden">
        <div className="w-64 h-fit">
          <FileStructureSidebar />
        </div>
        <div className="flex-1 overflow-auto mt-5 py-4 px-4">
          <DisplayTable />
        </div>
      </div>
    </>
  );
}

export default App;
