import React, { useEffect } from "react";
import { Editable } from "./file-structure";
import Dropdown from "./horizontal-tab";
import { getData } from "../utils/requestUtils";
import { Disclosure } from "@headlessui/react";
import { CgMenuMotion } from "react-icons/cg";
import { IoIosArrowDropdown, IoIosArrowDropright } from "react-icons/io";
import { DropTransition } from "./helper-components";
import { VscJson } from "react-icons/vsc";
import JsonView from "@uiw/react-json-view";
import { ExampleDomainFolderID } from "../pages/home-page";
import useEditorToolTip from "../hooks/useEditorToolTip";
import Tippy from "@tippyjs/react";
import "./jsonViewer.css";
import { FaHtml5 } from "react-icons/fa";
import prettier from "prettier/standalone";

export interface ExampleData {
  summary: string;
  description: string;
  apiName: string;
  $ref: string;
  exampleJson: Record<string, any> | string;
  formName?: string;
  formHtml?: string;
}

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
    registerID: ExampleDomainFolderID,
    query: {
      getData: getExampleFolder,
      Parent: exampleEditable.query.Parent,
      updateParams: {
        oldName: selectedFolder,
        summary: folderData[selectedFolder ?? ""]?.summary,
        description: folderData[selectedFolder ?? ""]?.description,
      },
      copyData: async () => {
        const data: Record<string, ExampleData[]> = await getData(
          exampleEditable.path + "/" + selectedFolder
        );
        const exampleFormat = await convertFormat(data);
        return JSON.stringify(exampleFormat, null, 2);
      },
    },
  };
  const editable: Editable = {
    name: selectedFolder ?? "",
    path: exampleEditable.path + "/" + selectedFolder,
    deletePath: exampleEditable.path + "/" + selectedFolder,
    registerID: ExampleDomainFolderID,
    query: {
      Parent: exampleEditable,
      getData: FolderEditable.query.getData,
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
          <div className="mt-1 p-3 shadow-md bg-gray-300 mr-2">
            <div className="text-left">
              <h2 className="text-base  mb-1">
                Summary:{" "}
                <span className="text-blue-500">
                  {folderData[selectedFolder].summary}
                </span>
              </h2>
              Description:{" "}
              <span className=" text-base text-blue-500">
                {folderData[selectedFolder].description}
              </span>
            </div>
          </div>
        )}
      </div>
      {selectedFolder && folderData[selectedFolder] && (
        <ExampleApis example={editable} reRender={reRender.current} />
      )}
    </div>
  );
}

function ExampleApis({
  example,
  reRender,
}: {
  example: Editable;
  reRender: boolean;
}) {
  const [apiData, setApiData] = React.useState<Record<string, ExampleData[]>>(
    {}
  );
  async function getExampleApis() {
    const data = await getData(example.path);
    setApiData(data);
  }
  useEffect(() => {
    getExampleApis();
  }, [reRender, example.name]);
  return (
    <div>
      <div className="mt-2 max-w-full">
        <div className="flex w-full">
          <div className="flex-1">
            {apiData &&
              Object.keys(apiData).map((apiName, index) => (
                <ExampleDisclose
                  key={index}
                  apiName={apiName}
                  data={apiData[apiName]}
                  exampleEditable={example}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ExampleDisclose({
  apiName,
  data,
  exampleEditable,
}: {
  apiName: string;
  data: ExampleData[];
  exampleEditable: Editable;
}) {
  const apiToolTip = useEditorToolTip([false, true, true]);
  const editable: Editable = {
    name: apiName,
    path: exampleEditable.path,
    deletePath: exampleEditable.path,
    registerID: ExampleDomainFolderID,
    query: {
      Parent: exampleEditable.query.Parent,
      getData: exampleEditable.query.getData,
      addParams: { apiCat: apiName },
      deleteParams: {
        folderName: apiName,
      },
      copyData: async () => {
        const d: Record<string, ExampleData[]> = {};
        d[apiName] = data;
        const formatted = await convertFormat(d);
        return JSON.stringify(formatted, null, 2);
      },
    },
  };
  apiToolTip.data.current = editable;
  return (
    <Disclosure>
      {({ open }) => (
        <>
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
          <DropTransition>
            <Disclosure.Panel>
              {data.map((t, i) => (
                <ExampleList
                  key={i}
                  exampleData={t}
                  index={i}
                  exampleEditable={editable}
                />
              ))}
              {data.length === 0 && <div>No Examples</div>}
            </Disclosure.Panel>
          </DropTransition>
        </>
      )}
    </Disclosure>
  );
}

function ExampleList({
  exampleData,
  index,
  exampleEditable,
}: {
  exampleData: ExampleData;
  index: number;
  exampleEditable: Editable;
}) {
  const tagToolTip = useEditorToolTip([true, false, true]);
  const jsonToolTip = useEditorToolTip([true, false, false]);

  if (exampleData.formName && exampleData.formHtml) {
    return (
      <FormDisclose
        formName={exampleData.formName}
        formHtml={exampleData.formHtml}
        editable={exampleEditable}
      />
    );
  }

  const editable: Editable = {
    name: exampleEditable.name,
    path: exampleEditable.path,
    deletePath: exampleEditable.path,
    registerID: ExampleDomainFolderID,
    query: {
      Parent: exampleEditable.query.Parent,
      getData: exampleEditable.query.getData,
      addParams: { apiCat: exampleData.apiName },
      updateParams: {
        exampleName: exampleData.apiName,
        summary: exampleData.summary,
        description: exampleData.description,
        formType: "EditExampleCategory",
        exampleJson: exampleData.exampleJson,
      },
      deleteParams: {
        folderName: exampleEditable.name,
        exampleName: exampleData.apiName,
      },
      copyData: async () => {
        const formatted = await convertFormat({
          [exampleEditable.name]: [exampleData],
        });
        return JSON.stringify(formatted, null, 2);
      },
    },
  };
  tagToolTip.data.current = editable;

  const jsonEditable: Editable = {
    name: exampleEditable.name,
    path: exampleEditable.path,
    deletePath: exampleEditable.path,
    registerID: ExampleDomainFolderID,
    query: {
      Parent: exampleEditable.query.Parent,
      getData: exampleEditable.query.getData,
      addParams: {
        formType: "AddExample",
        exampleData: exampleData.exampleJson,
        data: exampleData,
      },
      copyData: async () => {
        const formatted = await convertFormat({
          [exampleEditable.name]: [exampleData],
        });
        return JSON.stringify(formatted, null, 2);
      },
    },
  };
  jsonToolTip.data.current = jsonEditable;

  return (
    <Disclosure key={index}>
      <Disclosure.Button
        className="flex ml-6 mt-3 w-full px-4 py-2 text-base font-medium text-left text-black bg-gray-200 hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75 shadow-md hover:shadow-lg"
        onContextMenu={tagToolTip.onContextMenu}
      >
        <Tippy {...tagToolTip.tippyProps}>
          <div className="flex items-center">
            <VscJson size={20} className="mr-2" />
            <span>{exampleData.apiName}</span>
          </div>
        </Tippy>
      </Disclosure.Button>
      <Disclosure.Panel>
        <div className="ml-6 p-3 shadow-inner bg-gray-200">
          <div className="p-2 border border-blue-50 mr-2 ">
            <div className="text-left">
              <h2 className="mb-1">
                <span>Summary: {exampleData.summary}</span>
              </h2>
              <p>Description: {exampleData.description}</p>
              <span
                className="bg-gray-100m p-3 text-gray-800 font-mono block whitespace-pre-wrap shadow 
              "
                style={{ maxHeight: "400px", overflow: "auto" }}
              >
                <Tippy {...jsonToolTip.tippyProps}>
                  <JsonView
                    onContextMenu={jsonToolTip.onContextMenu}
                    value={exampleData.exampleJson as Record<string, any>}
                    displayDataTypes={false}
                    className="jsonViewer text-xl"
                    style={{ fontSize: "15px" }}
                  />
                </Tippy>
              </span>
            </div>
          </div>
        </div>
      </Disclosure.Panel>
    </Disclosure>
  );
}

function FormDisclose({
  formName,
  formHtml,
  editable,
}: {
  formName: string;
  formHtml: string;
  editable: Editable;
}) {
  const [html, setHtml] = React.useState(formHtml);
  useEffect(() => {
    prettier.format(formHtml, { parser: "html" }).then((formatted) => {
      setHtml(formatted);
    });
  }, [formHtml]);

  const formEditable: Editable = {
    name: formName,
    path: editable.path,
    deletePath: editable.path,
    registerID: ExampleDomainFolderID,
    query: {
      Parent: editable.query.Parent,
      getData: editable.query.getData,
      deleteParams: {
        formName: formName,
      },
      addParams: {
        formType: "AddHTML",
        exampleData: html,
      },
      copyData: async () => {
        let summary = formName.split("_").slice(1).join(" ");
        const d = {
          examples: {
            form: [
              {
                ID: "FORM",
                name: "form",
                summary: summary,
                exampleValue: html,
              },
            ],
          },
        };
        return JSON.stringify(d, null, 2);
      },
    },
  };
  const jsonToolTip = useEditorToolTip([true, false, true]);
  jsonToolTip.data.current = formEditable;
  return (
    <Disclosure>
      <Disclosure.Button
        onContextMenu={jsonToolTip.onContextMenu}
        className="flex ml-6 mt-3 w-full px-4 py-2 text-base font-medium text-left text-black bg-gray-200 hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75 shadow-md hover:shadow-lg"
      >
        <Tippy {...jsonToolTip.tippyProps}>
          <div className="flex items-center">
            <FaHtml5 size={20} className="mr-2" />
            <span>{formName}</span>
          </div>
        </Tippy>
      </Disclosure.Button>
      <Disclosure.Panel>
        <div className="ml-6 p-3 shadow-inner bg-gray-100">
          <div className="p-2 border border-blue-50 mr-2">
            <div className="text-left flex w-full">
              <pre className=" text-gray-800 block shadow w-full">{html}</pre>
              <pre
                className="content text-gray-800 block shadow w-full"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            </div>
          </div>
        </div>
      </Disclosure.Panel>
    </Disclosure>
  );
}

async function convertFormat(data: Record<string, ExampleData[]>) {
  const exampleFormat = {
    examples: {} as any,
  };

  for (const key in data) {
    exampleFormat.examples[key] = data[key].map((e) => {
      const converted = {
        ID: "JSON",
        // name: key,
        // exampleName: e.apiName,
        summary: e.summary,
        description: e.description,
        exampleValue: e.exampleJson,
      };
      if (e.formHtml && e.formName) {
        converted.ID = "FORM";
        converted.exampleValue = e.formHtml;
        converted.summary = e.formName;
        // converted.exampleName = e.formName;
      }
      return converted;
    });
  }
  return exampleFormat;
}
