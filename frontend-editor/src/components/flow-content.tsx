import { useEffect, useRef, useState } from "react";
import { Editable } from "./file-structure";
import { getData } from "../utils/requestUtils";
import React from "react";
import { FlowFileID, flowFolderID } from "../pages/home-page";
import Dropdown from "./horizontal-tab";
import { Disclosure } from "@headlessui/react";
import useEditorToolTip from "../hooks/useEditorToolTip";
import Tippy from "@tippyjs/react";
import { CgMenuMotion } from "react-icons/cg";
import { IoIosArrowDropdown, IoIosArrowDropright } from "react-icons/io";
import { GoRelFilePath } from "react-icons/go";
import { DropTransition } from "./helper-components";
import HorizontalTabBar from "./horizontal-tab";
import { MermaidDiagram } from "../components/ui/mermaid";
import JsonView from "@uiw/react-json-view";
import "./jsonViewer.css";

//ignore
interface Flow {
  code: string;
  description: string;
  required: string;
  list: {
    code: string;
    description: string;
  }[];
}

// ignore
interface FlowData {
  path: string;
  flow: Flow[];
}
//ignore
type FlowResponse = Record<string, FlowData[]>;

// main component
export function FlowFolderContent({ flowFolder }: { flowFolder: Editable }) {
  const [folderData, setFolderData] = useState<string[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string>();
  const [editType, setEditType] = useState<any>([
    "select an option",
    "flow",
    "steps",
  ]);
  const [selectedEditType, setSelectedEditType] = useState<any>([
    "flow",
    "steps",
  ]);
  // console.log(selectedFolder)
  const reRender = useRef(false);
  async function getflowFolder() {
    try {
      // return
      const data = await getData(flowFolder.path);
      // console.log("myworld")
      setFolderData(data);
      if (data.length > 0 && !selectedFolder) {
        setSelectedFolder(data[0]);
      }
      reRender.current = !reRender.current;
      // console.log(data);
    } catch (err) {
      console.log(err);
    }
  }
  flowFolder.query.getData = getflowFolder;

  React.useEffect(() => {
    getflowFolder();
  }, [selectedFolder]);

  const FolderEditable: Editable = {
    name: selectedFolder ?? "",
    path: flowFolder.path + "/" + selectedFolder,
    deletePath: flowFolder.path + "/" + selectedFolder,
    registerID: flowFolder.registerID,
    query: {
      getData: getflowFolder,
      Parent: flowFolder.query.Parent,
      addParams: {},
      updateParams: { oldName: selectedFolder },
      copyData: async () => {
        const data = await getData(flowFolder.path + "/" + selectedFolder);
        return JSON.stringify(data, null, 2);
      },
    },
  };
  const FlowEditable: Editable = {
    name: selectedFolder ?? "",
    path: flowFolder.path + "/" + selectedFolder,
    deletePath: flowFolder.path + "/" + selectedFolder,
    registerID: flowFolder.registerID,
    query: {
      Parent: flowFolder,
      getData: async () => {
        console.log("hello");
      },
    },
  };

  if (FolderEditable.query.addParams) {
    FolderEditable.query.addParams = { type: "add" };
  }

  return (
    <>
      <div className="mt-3 ml-3 max-w-full">
        <div className="flex w-full">
          <div className="flex-1">
            <HorizontalTabBar
              items={folderData}
              selectedItem={selectedFolder ?? ""}
              setSelectedItem={setSelectedFolder}
              onOpen={getflowFolder}
              editable={FolderEditable}
            />
          </div>
          <div className="flex-1">
            {/* <HorizontalTabBar
            items={editType}
            selectedItem={editType ?? ""}
            setSelectedItem={setEditType}
            onOpen={getflowFolder}
            editable={FolderEditable}
          /> */}
          </div>
        </div>

        {selectedFolder && selectedFolder !== "" && (
          <FlowContent flows={FlowEditable} reRender={reRender.current} />
        )}
      </div>
    </>
  );
}

// grandchild component
export function DetailsContent({
  detailData,
  element,
  index,
  reRender,
  apiName,
  editable,
}: any) {
  const apiToolTip = useEditorToolTip([true, false, true]);
  const apiEditable = { ...editable };
  apiEditable.name = apiName;
  apiEditable.registerID = FlowFileID;
  apiEditable.query = {
    getData: editable.query.getData,
    Parent: editable,
    addParams: { type: "flow" },
    deleteParams: {},
    updateParams: { data: detailData, type: "edit", index },
    Params: {},
    copyData: async () => {
      const copyData: Record<string, FlowData[]> = {};
      copyData[apiName] = detailData;
      return JSON.stringify(copyData, null, 2);
    },
  };
  if (apiEditable.query.deleteParams) {
    apiEditable.query.deleteParams[apiName] = [index];
  }
  apiToolTip.data.current = apiEditable;
  React.useEffect(() => {
    // getFlow();
  }, [reRender]);

  // console.log("element", detailData);
  return (
    <>
      {apiName == "details" && (
        <Disclosure key={index}>
          <Disclosure.Button
            className="flex ml-6 mt-1 w-full px-4 py-2 text-base font-medium text-left text-black bg-gray-200 hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75 shadow-md hover:shadow-lg"
            onContextMenu={apiToolTip.onContextMenu}
          >
            <Tippy {...apiToolTip.tippyProps}>
              <div className="flex items-center">
                <CgMenuMotion size={20} className="mr-2" />
                <span>{element.description}</span>
              </div>
            </Tippy>
          </Disclosure.Button>
          <Disclosure.Panel>
            <p>
              <MermaidDiagram keys={index} chartDefinition={element.mermaid} />
            </p>
          </Disclosure.Panel>
        </Disclosure>
      )}
    </>
  );
}

export function GenericContent({
  data,
  reRender,
  apiName,
  editable,
  hover = true,
}: any) {
  const apiToolTip = useEditorToolTip();

  React.useEffect(() => {
    // getFlow();
  }, [reRender]);

  return (
    <div
      className={`flex ml-6 mt-1 w-full px-4 py-2 text-base font-medium text-left text-black bg-gray-200 ${
        hover && "hover:bg-blue-200"
      } focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75 shadow-md hover:shadow-lg`}
    >
      <p> {data}</p>
    </div>
  );
}

// grandchild component
export function StepsContent({
  detailData,
  apiName,
  element,
  index,
  editable,
  examples,
}: {
  detailData: any;
  apiName: string;
  element: any;
  index: number;
  editable: Editable;
  examples: { $ref: string; value: Record<string, any> }[];
}) {
  const apiToolTip = useEditorToolTip([true, false, true]);
  const bodyToolTip = useEditorToolTip([true, false, true]);

  const apiEditable = { ...editable };
  apiEditable.name = apiName;
  apiEditable.registerID = FlowFileID;
  apiEditable.query = {
    getData: editable.query.getData,
    Parent: editable,
    addParams: { type: "flow" },
    deleteParams: {},
    updateParams: { data: detailData, type: "edit", index },
    // Params: {},
    copyData: async () => {
      const copyData: Record<string, FlowData[]> = {};
      copyData[apiName] = detailData;
      return JSON.stringify(copyData, null, 2);
    },
  };
  if (apiEditable.query.deleteParams) {
    apiEditable.query.deleteParams[apiName] = [index];
  }
  apiToolTip.data.current = apiEditable;
  bodyToolTip.data.current = apiEditable;
  return (
    <>
      {apiName == "steps" && (
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button
                onContextMenu={apiToolTip.onContextMenu}
                className="flex ml-6 mt-1 w-full px-4 py-2 text-base font-medium text-left text-black bg-gray-200 hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75 shadow-md hover:shadow-lg"
              >
                <Tippy {...apiToolTip.tippyProps}>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      <CgMenuMotion size={20} className="mr-2" />
                      <span className="font-extrabold">{element.api}</span>
                      <span className="flex items-end">
                        : {element.summary}
                      </span>
                    </div>

                    {open ? (
                      <IoIosArrowDropdown size={25} />
                    ) : (
                      <IoIosArrowDropright size={25} />
                    )}
                  </div>
                </Tippy>
              </Disclosure.Button>
              <DropTransition>
                <Disclosure.Panel>
                  <Tippy {...bodyToolTip.tippyProps}>
                    <div
                      className="ml-6 p-2 shadow-inner"
                      onContextMenu={bodyToolTip.onContextMenu}
                    >
                      <table className="w-full border-collapse table-auto">
                        <tbody className="w-full">
                          {Object.keys(element).map(function (key, index) {
                            if (key == "example") {
                              console.log(element[key], "HELLOOO");
                              const example = examples.find((ex) => {
                                console.log(ex.$ref, element[key].value.$ref);
                                return ex.$ref === element[key].value.$ref;
                              });

                              return (
                                <>
                                  <tr>
                                    <td className="px-4 py-2 text-left border-b border-gray-200 align-top break-words text-base">
                                      {key}
                                    </td>
                                    <div className="p-2 bg-gray-50 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-200 w-full">
                                      <span>
                                        {element[key]?.summary ?? "example"}
                                      </span>
                                      <span
                                        className="bg-gray-100m p-3 text-gray-800 font-mono block whitespace-pre-wrap shadow 
              "
                                        style={{
                                          maxHeight: "400px",
                                          overflow: "auto",
                                        }}
                                      >
                                        <JsonView
                                          value={
                                            example?.value ?? {
                                              "NOT FOUND": "NOT FOUND",
                                            }
                                          }
                                          displayDataTypes={false}
                                          className="jsonViewer text-xl"
                                          style={{ fontSize: "15px" }}
                                        />
                                      </span>
                                    </div>
                                  </tr>
                                </>
                              );
                            }
                            if (key == "details") {
                              return (
                                <>
                                  <tr>
                                    <td className="px-4 py-2 text-left border-b border-gray-200 align-top break-words text-base">
                                      {key}
                                    </td>
                                    <td className="px-4 py-2 text-left border-b border-gray-200 align-top break-words text-base">
                                      {element[key][0] &&
                                        JSON.stringify(
                                          element[key][0]["description"]
                                        )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="px-4 py-2 text-left border-b border-gray-200 align-top break-words text-base">
                                      {"diagram"}
                                    </td>
                                    <td className="px-4 py-2 text-left border-b border-gray-200 align-top break-words text-base">
                                      {element[key][0] && (
                                        <div className="relative w-full max-w-3xl overflow-hidden">
                                          {/* <div> */}
                                          <MermaidDiagram
                                            chartDefinition={
                                              element[key][0]["mermaid"]
                                            }
                                            keys={index.toString()}
                                          />
                                          {/* </div> */}
                                        </div>
                                      )}
                                    </td>
                                  </tr>
                                </>
                              );
                            }
                            return (
                              <tr>
                                <td className="px-4 py-2 text-left border-b border-gray-200 align-top break-words text-base">
                                  {key}
                                </td>
                                <td className="px-4 py-2 text-left border-b border-gray-200 align-top break-words text-base">
                                  {JSON.stringify(element[key])}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </Tippy>
                </Disclosure.Panel>
              </DropTransition>
            </>
          )}
        </Disclosure>
      )}
    </>
  );
}

// showing summary/details/reference/steps etc
export function FlowContent({
  flows,
  reRender,
}: {
  flows: Editable;
  reRender: Boolean;
}) {
  const [flowData, setFlowData] = useState<FlowResponse>();

  async function getFlow() {
    let data = await getData(flows.path);
    const dataArray = ["summary", "details", "references", "steps"];
    let cleanedData: any = {};
    if (data !== undefined) {
      dataArray.forEach((api) => {
        cleanedData[api] = data[api] || [];
      });
      data = cleanedData;
    }
    setFlowData(data);
    reRender = !reRender;
  }
  flows.query.getData = getFlow;
  React.useEffect(() => {
    getFlow();
  }, [reRender]);

  return (
    <>
      <div className="mt-2 max-w-full">
        <div className="flex w-full">
          <div className="flex-1">
            {flowData &&
              Object.keys(flowData).map((apiName, index) => (
                <FlowDisclose
                  key={index}
                  apiName={apiName}
                  data={flowData[apiName]}
                  flowEditable={flows}
                />
              ))}
          </div>
        </div>
      </div>
    </>
  );
}

// child component
function FlowDisclose({
  apiName,
  data,
  flowEditable,
}: {
  apiName: string;
  data: any;
  //  FlowData[];
  flowEditable: Editable;
}) {
  const apiToolTip = useEditorToolTip([true, false, false]);
  let apiToolTip2 = useEditorToolTip([false, true, false]);

  const apiEditable = { ...flowEditable };
  apiEditable.name = apiName;
  console.log(apiName, "ahsan-->");
  apiEditable.registerID = FlowFileID;
  apiEditable.query = {
    getData: flowEditable.query.getData,
    Parent: flowEditable,
    addParams: { type: "flow" },
    deleteParams: {},
    updateParams: {
      data,
      ...((apiName === "details" || apiName === "steps") && { type: "new" }),
    },
    copyData: async () => {
      const copyData: Record<string, FlowData[]> = {};
      copyData[apiName] = data;
      return JSON.stringify(copyData, null, 2);
    },
  };
  if (apiEditable.query.deleteParams) {
    apiEditable.query.deleteParams[apiName] = JSON.stringify([]);
  }

  apiToolTip2.data.current = apiEditable;
  apiToolTip.data.current = apiEditable;

  const [examples, setExamples] = useState<
    { $ref: string; value: Record<string, any> }[]
  >([]);
  async function fetchExamples() {
    const path = flowEditable.path?.replace("flows", "examples").split("/");
    path.pop();
    let newPath = path.join("/");
    const ex = await getData(newPath, { type: "reference" });
    console.log(ex.refs);
    setExamples(ex.refs);
  }
  useEffect(() => {
    fetchExamples();
  }, []);

  return (
    <Disclosure>
      {({ open }) => (
        <>
          {(apiName === "summary" || apiName === "references") && (
            <Disclosure.Button
              className="flex items-center justify-between mt-3 w-full px-4 py-2 text-base font-medium text-left text-black bg-gray-300 hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75 shadow-md hover:shadow-lg
          transition duration-300 ease-in-out"
              onContextMenu={apiToolTip.onContextMenu}
            >
              <Tippy {...apiToolTip.tippyProps}>
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center">
                    <CgMenuMotion size={20} className="mr-2" />
                    <span>{apiName}</span>
                  </div>
                  {open ? (
                    <IoIosArrowDropdown size={25} />
                  ) : (
                    <IoIosArrowDropright size={25} />
                  )}
                </div>
              </Tippy>
            </Disclosure.Button>
          )}
          {(apiName === "details" || apiName === "steps") && (
            <Disclosure.Button
              className="flex items-center justify-between mt-3 w-full px-4 py-2 text-base font-medium text-left text-black bg-gray-300 hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75 shadow-md hover:shadow-lg
          transition duration-300 ease-in-out"
              onContextMenu={apiToolTip2.onContextMenu}
            >
              <Tippy {...apiToolTip2.tippyProps}>
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center">
                    <CgMenuMotion size={20} className="mr-2" />
                    <span>{apiName}</span>
                  </div>
                  {open ? (
                    <IoIosArrowDropdown size={25} />
                  ) : (
                    <IoIosArrowDropright size={25} />
                  )}
                </div>
              </Tippy>
            </Disclosure.Button>
          )}
          <DropTransition>
            <Disclosure.Panel>
              {apiName == "summary" && (
                <GenericContent
                  data={data}
                  editable={flowEditable}
                  hover={false}
                />
              )}
              {open &&
                apiName == "details" &&
                data.map((element: any, index: number) => (
                  <DetailsContent
                    key={index}
                    detailData={data}
                    element={element}
                    index={index}
                    reRender={false}
                    apiName={apiName}
                    editable={flowEditable}
                  />
                ))}
              {apiName == "references" && (
                <GenericContent data={data} hover={false} />
              )}
              {apiName == "steps" &&
                // <StepsContent apiName={apiName} detailData={data} editable={flowEditable} />
                data.map((element: any, index: number) => (
                  <StepsContent
                    key={index}
                    detailData={data}
                    element={element}
                    index={index}
                    apiName={apiName}
                    editable={flowEditable}
                    examples={examples}
                  />
                ))}
            </Disclosure.Panel>
          </DropTransition>
        </>
      )}
    </Disclosure>
  );
}
