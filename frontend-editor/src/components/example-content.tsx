import React from "react";
import { Editable } from "./file-structure";
import Dropdown from "./horizontal-tab";
import { getData } from "../utils/requestUtils";

export function ExampleContent({
  exampleEditable,
}: {
  exampleEditable: Editable;
}) {
  const [folderData, setFolderData] = React.useState<Record<string, any>>({});
  const [selectedFolder, setSelectedFolder] = React.useState<string>();
  const reRender = React.useRef(false);
  async function getExampleFolder() {
    const data = await getData(exampleEditable.path);
    setFolderData(data);
    if (Object.keys(data).length > 0 && !selectedFolder) {
      setSelectedFolder(Object.keys(data)[0]);
    }
    reRender.current = !reRender.current;
  }
  exampleEditable.query.getData = getExampleFolder;

  React.useEffect(() => {
    getExampleFolder();
  }, []);

  const FolderEditable: Editable = {
    name: selectedFolder ?? "",
    path: exampleEditable.path + "/" + selectedFolder,
    deletePath: exampleEditable.path + "/" + selectedFolder,
    registerID: "EXAMPLE_FILE",
    query: {
      getData: getExampleFolder,
      Parent: exampleEditable.query.Parent,
      updateParams: { oldName: selectedFolder },
      copyData: async () => {
        const data = await getData(exampleEditable.path + "/" + selectedFolder);
        return JSON.stringify(data, null, 2);
      },
    },
  };

  return (
    <div className="mt-3 ml-3 max-w-full">
      <div className="flex-1">
        <Dropdown
          items={Object.keys(folderData)}
          selectedItem={selectedFolder ?? ""}
          setSelectedItem={setSelectedFolder}
          onOpen={getExampleFolder}
          editable={FolderEditable}
        />
        {selectedFolder && folderData[selectedFolder] && (
          <div className="mt-2 p-4 bg-blue-50 shadow-md border border-blue-500 mr-2">
            <div className="text-left">
              <h2 className="text-lg font-semibold  mb-2">
                <span className="text-blue-500">
                  {folderData[selectedFolder].summary}
                </span>
              </h2>
              <p className="text-md text-blue-500">
                {folderData[selectedFolder].description}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
