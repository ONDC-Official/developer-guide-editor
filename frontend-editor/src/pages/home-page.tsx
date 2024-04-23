import React, { useEffect } from "react";
import AttributesTable from "../components/attribute-table";
import { ComponentsStructure, Editable } from "../components/file-structure";
import { getData } from "../utils/requestUtils";
import FullPageLoader from "../components/loader";
import { MainContent } from "../components/main-content";
import { DataContext } from "../context/dataContext";

export const sessionID = "test";
export const CompFolderName = "cp0";
export const CompFolderID = "COMPONENTS-FOLDER";
export const AttributeFolderID = "ATTRIBUTE_FOLDER";
export const AttributeFileID = "ATTRIBUTE_FILE";

export function HomePage() {
  const [loading, setLoading] = React.useState(false);
  const [components, setComponents] = React.useState([] as any);
  const [acitiveEditable, setActiveEditable] = React.useState({} as Editable);

  useEffect(() => {
    FetchData();
  }, []);
  function FetchData() {
    setLoading(true);
    const fetchData = async () => {
      const comp = await getData({
        sessionID: sessionID,
        editableID: CompFolderID,
        editableName: CompFolderName,
      });
      return comp;
    };
    fetchData().then((comp) => {
      setComponents(comp);
      setLoading(false);
    });
  }
  return (
    <DataContext.Provider
      value={{
        FetchData: FetchData,
        setActiveEditable: setActiveEditable,
        acitiveEditable: acitiveEditable,
      }}
    >
      <div className="flex w-full h-full overflow-hidden">
        <ComponentsStructure components={components} />
        <div className=" mt-20 ml-64 w-full">
          <MainContent acitiveEditable={acitiveEditable} />
        </div>
      </div>
      {loading && <FullPageLoader />}
    </DataContext.Provider>
  );
}
