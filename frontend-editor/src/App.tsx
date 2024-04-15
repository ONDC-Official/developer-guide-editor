import "./App.css";
import {
  FileStructureSidebar,
  FileSystemItem,
  DirectoryItem,
  FileItem,
} from "./components/file-structure";
import { OndcTitle } from "./components/title";
import files from "./files.json";

function App() {
  const formattedData: FileSystemItem[] = files.struct.map((item) => {
    if (item.type === "directory") {
      return item as DirectoryItem;
    }
    return {
      ...item,
      type: "file",
    };
  });

  return (
    <>
      <OndcTitle />
      <FileStructureSidebar data={formattedData} />
    </>
  );
}

export default App;
