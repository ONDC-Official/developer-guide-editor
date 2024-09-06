import React, { useContext, useEffect, useState } from "react";
import { ComponentsStructure, Editable } from "../components/file-structure";
import { UndoData, getData } from "../utils/requestUtils";
import FullPageLoader from "../components/loader";
import { MainContent } from "../components/main-content";
import { DataContext } from "../context/dataContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GitActionsTab } from "../components/GitActionsTab";
import { useNavigate, useParams } from "react-router-dom";
import { setEncryptedCookie } from "../utils/cookieUtils";
import build from "../files.json";
import { BUILD_TYPE } from "../types/buildTypes";
interface FetchedComponents {
  name: string;
  registerID: string;
  path: string;
}
export const CompFolderID = "COMPONENTS-FOLDER";
export const AttributeFolderID = "ATTRIBUTE_FOLDER";
export const AttributeFileID = "ATTRIBUTE_FILE";
export const EnumFolderID = "ENUM_FOLDER";
export const EnumFileId = "ENUM_FILE";
export const TagFolderID = "TAG_FOLDER";
export const TagFileID = "TAG_FILE";
export const ExampleFolderID = "EXAMPLE_FOLDER";
export const ExampleDomainFolderID = "EXAMPLE_DOMAIN_FOLDER";
export const flowFolderID = "FLOW_FOLDER";
export const FlowFileID = "FLOW_FILE";

export function HomePage({ editMode }: { editMode: boolean }) {
  const [loading, setLoading] = React.useState(false);
  const [components, setComponents] = React.useState([] as Editable[]);
  const activePath = React.useRef<string>("components");
  const [pathState, setPathState] = useState<string>("");
  const [activeEditable, setActiveEditable] = React.useState<Editable>();
  const [refresh, setRefresh] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  // console.log(build);
  const currentBuild = build as BUILD_TYPE;
  const buildKeys = Object.keys(currentBuild).filter((k) => k.startsWith("x-"));
  console.log(buildKeys);
  useEffect(() => {
    console.log("use effect");
    if (!id) {
      toast.error("Session Id not found");
      navigate("/user-page");
      return;
    }
    setEncryptedCookie(id);
    fetchData().catch((error) => {
      console.log("nvagating to login page");
      toast.error("Invalid Session ID");
      navigate("/user-page");
    });
  }, [pathState, refresh]);

  useEffect(() => {
    const handleKeyDown = async (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "z") {
        event.preventDefault(); // Prevent the browser's default undo behavior
        console.log("Ctrl/Cmd + Z pressed");
        try {
          setLoading(true);
          await UndoData(activePath.current);
          toast.success("Undo successful!");
          await fetchData();
          setLoading(false);
        } catch (error: any) {
          toast.error("NO undo data available");
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
    deletePath: activePath.current,
    registerID: CompFolderID,
    query: {
      getData: fetchData,
      Parent: null,
    },
  };

  async function fetchData() {
    console.log("fetching data");
    setLoading(true);
    let getComp: FetchedComponents[] = [];

    getComp = await getData(activePath.current);
    let compsList: Editable[] = [];
    for (let comp of getComp) {
      const editable: Editable = {
        name: comp.name,
        registerID: comp.registerID,
        path: comp.path,
        deletePath: comp.path,
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
        setReload: setRefresh,
        components: compEditable,
        editMode: editMode,
      }}
    >
      (
      <ComponentView
        components={components}
        activeEditable={activeEditable}
        parentComp={compEditable}
        buildData={currentBuild}
      />
      ){loading && <FullPageLoader />}
    </DataContext.Provider>
  );
}

function ComponentView({
  components,
  activeEditable: activeEditable,
  parentComp,
  buildData,
}: {
  components: Editable[];
  activeEditable: Editable | undefined;
  parentComp: Editable;
  buildData: BUILD_TYPE;
}) {
  const editState = useContext(DataContext).editMode;
  console.log(buildData);
  return (
    <>
      <GitActionsTab />
      <div className="flex w-full h-full overflow-hidden">
        <ComponentsStructure
          componentsChildren={components}
          componentParent={parentComp}
        />
        <div className=" mt-32 ml-64 w-full">
          <MainContent activeEditable={activeEditable} />
        </div>
      </div>
    </>
  );
}
