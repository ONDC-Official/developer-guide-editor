import React, { useEffect } from "react";
import { ComponentsStructure, Editable } from "../components/file-structure";
import { getData } from "../utils/requestUtils";
import FullPageLoader from "../components/loader";
import { MainContent } from "../components/main-content";
import { DataContext } from "../context/dataContext";
import LoadComponent from "../components/LoadComponent";

export const CompFolderName = "cp0";
export const CompFolderID = "COMPONENTS-FOLDER";
export const AttributeFolderID = "ATTRIBUTE_FOLDER";
export const AttributeFileID = "ATTRIBUTE_FILE";

export function HomePage() {
  const [loading, setLoading] = React.useState(false);
  const [components, setComponents] = React.useState([] as Editable[]);
  const [activePath, setActivePath] = React.useState("");
  const [acitiveEditable, setActiveEditable] = React.useState({} as Editable);

  useEffect(() => {
    FetchData("cpo");
  }, []);

  function FetchData(path: string) {
    setLoading(true);
    const fetchData = async () => {
      const comp = await getData(path);
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
        components: components,
        activePath: activePath,
        setActivePath: setActivePath,
        loading: loading,
        setLoading: setLoading,
        acitiveEditable: acitiveEditable,
        setActiveEditable: setActiveEditable,
      }}
    >
      {activePath === "" ? <LoadComponent /> : <ComponentView />}
    </DataContext.Provider>
  );
}

function ComponentView() {
  const dataContext = React.useContext(DataContext);
  const { components, acitiveEditable, loading } = dataContext;
  return (
    <>
      <div className="flex w-full h-full overflow-hidden">
        <ComponentsStructure components={components as Editable[]} />
        <div className=" mt-20 ml-64 w-full">
          <MainContent acitiveEditable={acitiveEditable} />
        </div>
      </div>
      {loading && <FullPageLoader />}
    </>
  );
}
