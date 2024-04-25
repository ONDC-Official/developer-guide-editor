import React, { useEffect } from "react";
import { ComponentsStructure, Editable } from "../components/file-structure";
import { getData } from "../utils/requestUtils";
import FullPageLoader from "../components/loader";
import { MainContent } from "../components/main-content";
import { DataContext } from "../context/dataContext";
import LoadComponent from "../components/LoadComponent";

interface FetchedComponents {
  name: string;
  registerID: string;
  path: string;
}
export const CompFolderID = "COMPONENTS-FOLDER";
export const AttributeFolderID = "ATTRIBUTE_FOLDER";
export const AttributeFileID = "ATTRIBUTE_FILE";

export function HomePage() {
  const [loading, setLoading] = React.useState(false);
  const [components, setComponents] = React.useState([] as Editable[]);
  const [activePath, setActivePath] = React.useState("");
  const [acitiveEditable, setActiveEditable] = React.useState<Editable>();

  useEffect(() => {
    fetchData();
  }, [activePath]);

  // function FetchData(path = activePath) {
  //   if (activePath === "") return;
  //   setLoading(true);
  //   const fetchData = async () => {
  //     const comp = await getData(path);
  //     return comp;
  //   };
  //   fetchData().then((comp) => {
  //     setComponents(comp);
  //     setLoading(false);
  //   });
  // }
  const compEditable: Editable = {
    name: activePath,
    path: activePath,
    registerID: CompFolderID,
    query: {
      getData: fetchData,
      Parent: null,
    },
  };

  async function fetchData() {
    setLoading(true);
    let getComp: FetchedComponents[] = await getData(activePath);
    let compsList: Editable[] = [];
    for (let comp of getComp) {
      const editable: Editable = {
        name: comp.name,
        registerID: comp.registerID,
        path: comp.path,
        query: {
          Parent: compEditable,
          getData: async () => {},
        },
      };
      compsList.push(editable);
    }
    setComponents(compsList);
    setActiveEditable(compsList[0]);
    setLoading(false);
  }

  return (
    <DataContext.Provider
      value={{
        activePath: activePath,
        setActivePath: setActivePath,
        loading: loading,
        setLoading: setLoading,
        acitiveEditable: acitiveEditable,
        setActiveEditable: setActiveEditable,
      }}
    >
      {activePath === "" ? (
        <LoadComponent />
      ) : (
        <ComponentView
          components={components}
          acitiveEditable={acitiveEditable}
          parentComp={compEditable}
        />
      )}
      {loading && <FullPageLoader />}
    </DataContext.Provider>
  );
}

function ComponentView({
  components,
  acitiveEditable,
  parentComp,
}: {
  components: Editable[];
  acitiveEditable: Editable | undefined;
  parentComp: Editable;
}) {
  return (
    <>
      <div className="flex w-full h-full overflow-hidden">
        <ComponentsStructure
          componentsChildren={components}
          componentParent={parentComp}
        />
        <div className=" mt-20 ml-64 w-full">
          <MainContent acitiveEditable={acitiveEditable} />
        </div>
      </div>
    </>
  );
}
