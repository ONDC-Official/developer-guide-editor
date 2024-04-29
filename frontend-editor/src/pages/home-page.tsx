import React, { useEffect, useState } from "react";
import { ComponentsStructure, Editable } from "../components/file-structure";
import { UndoData, getData } from "../utils/requestUtils";
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
export const EnumFileID = "ENUM_FILE";

export function HomePage() {
  const [loading, setLoading] = React.useState(false);
  const [components, setComponents] = React.useState([] as Editable[]);
  const activePath = React.useRef<string>("");
  const [pathState, setPathState] = useState<string>("");
  const [activeEditable, setActiveEditable] = React.useState<Editable>();

  useEffect(() => {
    fetchData();
  }, [pathState]);

  useEffect(() => {
    const handleKeyDown = async (event: any) => {
      if (event.ctrlKey && event.key === "z") {
        event.preventDefault(); // Prevent the browser's default undo behavior
        console.log("Ctrl + Z pressed");
        try {
          console.log(activePath);
          await UndoData(activePath.current);
          await fetchData();
        } catch (error) {
          console.error("Error making PATCH request:", error);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const compEditable: Editable = {
    name: activePath.current,
    path: activePath.current,
    registerID: CompFolderID,
    query: {
      getData: fetchData,
      Parent: null,
    },
  };

  async function fetchData() {
    setLoading(true);
    let getComp: FetchedComponents[] = await getData(activePath.current);
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
    setActiveEditable(undefined);
    setLoading(false);
  }

  return (
    <DataContext.Provider
      value={{
        activePath: activePath,
        setActivePath: setPathState,
        loading: loading,
        setLoading: setLoading,
        activeEditable: activeEditable,
        setActiveEditable: setActiveEditable,
      }}
    >
      {activePath.current === "" ? (
        <LoadComponent />
      ) : (
        <ComponentView
          components={components}
          activeEditable={activeEditable}
          parentComp={compEditable}
        />
      )}
      {loading && <FullPageLoader />}
    </DataContext.Provider>
  );
}

function ComponentView({
  components,
  activeEditable: activeEditable,
  parentComp,
}: {
  components: Editable[];
  activeEditable: Editable | undefined;
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
          <MainContent activeEditable={activeEditable} />
        </div>
      </div>
    </>
  );
}
