import React, { useEffect } from "react";
import { Editable } from "./file-structure";
import Dropdown from "./horizontal-tab";
import { getData } from "../utils/requestUtils";
import { Disclosure } from "@headlessui/react";
import { CgMenuMotion } from "react-icons/cg";
import { IoIosArrowDropdown, IoIosArrowDropright } from "react-icons/io";
import { DropTransition } from "./helper-components";
import { VscJson } from "react-icons/vsc";
import JsonField from "./forms/JsonField";
import JsonView from "@uiw/react-json-view";
import { ExampleDomainFolderID } from "../pages/home-page";
import Draggable from "react-draggable";
import useEditorToolTip from "../hooks/useEditorToolTip";
import Tippy from "@tippyjs/react";
import "./jsonViewer.css";

export interface ExampleData {
  summary: string;
  description: string;
  apiName: string;
  $ref: string;
  exampleJson: Record<string, any>;
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
      updateParams: { oldName: selectedFolder },
      copyData: async () => {
        const data = await getData(exampleEditable.path + "/" + selectedFolder);
        return JSON.stringify(data, null, 2);
      },
    },
  };
  const editable: Editable = {
    name: selectedFolder ?? "",
    path: exampleEditable.path + "/" + selectedFolder,
    deletePath: exampleEditable.path + "/" + selectedFolder,
    registerID: "EXAMPLE_FILE",
    query: {
      Parent: exampleEditable,
      getData: async () => {
        console.log("hello");
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
  const apiToolTip = useEditorToolTip();
  const editable: Editable = {
    name: apiName,
    path: exampleEditable.path,
    deletePath: exampleEditable.path,
    registerID: ExampleDomainFolderID,
    query: {
      Parent: exampleEditable.query.Parent,
      getData: exampleEditable.query.getData,
      addParams: { apiCat: apiName },
      copyData: async () => {
        const d: Record<string, any> = {};
        d[apiName] = data;
        return JSON.stringify(d, null, 2);
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
  const tagToolTip = useEditorToolTip();
  const editable: Editable = {
    name: exampleEditable.name,
    path: exampleEditable.path,
    deletePath: exampleEditable.path,
    registerID: ExampleDomainFolderID,
    query: {
      Parent: exampleEditable.query.Parent,
      getData: exampleEditable.query.getData,
      addParams: { apiCat: exampleData.apiName },
      copyData: async () => {
        return JSON.stringify(exampleData, null, 2);
      },
    },
  };
  tagToolTip.data.current = editable;

  const jsonToolTip = useEditorToolTip([true, false, false]);

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
        const data = await getData(exampleEditable.query.Parent?.path ?? "", {
          type: "reference",
        });
        return JSON.stringify(data, null, 2);
        // return JSON.stringify(exampleData, null, 2);
      },
    },
  };
  jsonToolTip.data.current = jsonEditable;

  return (
    <Disclosure key={index}>
      <Disclosure.Button
        className="flex ml-6 mt-3 w-full px-4 py-2 text-base font-medium text-left text-black bg-gray-200 hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75 shadow-md hover:shadow-lg"
        // onContextMenu={tagToolTip.onContextMenu}
      >
        {/* <Tippy {...tagToolTip.tippyProps}> */}
        <div className="flex items-center">
          <VscJson size={20} className="mr-2" />
          <span>{exampleData.apiName}</span>
        </div>
        {/* </Tippy> */}
      </Disclosure.Button>
      <Disclosure.Panel>
        <div className="ml-6 p-3 shadow-inner bg-gray-200">
          <div className="p-2 border border-blue-50 mr-2 ">
            <div className="text-left">
              <h2 className="mb-1">
                <span>Summary: {exampleData.summary}</span>
              </h2>
              <p>Description: {exampleData.description}</p>
              <span className="bg-gray-100m p-3 text-gray-800 font-mono block whitespace-pre-wrap shadow">
                <Tippy {...jsonToolTip.tippyProps}>
                  <JsonView
                    onContextMenu={jsonToolTip.onContextMenu}
                    value={exampleData.exampleJson}
                    displayDataTypes={false}
                    className="jsonViewer"
                    // style={jsonTheme as React.CSSProperties} // Explicitly type the style prop
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

const jsonTheme = {
  "font-size": "14px",
  "--w-rjv-color": "#2c3e50", // Deep navy blue for general text
  "--w-rjv-key-number": "#e74c3c", // Bright red for numbers, good contrast
  "--w-rjv-key-string": "#2980b9", // Vibrant blue for string keys
  "--w-rjv-background-color": "#f3f4f6", // Light grey, your specified background
  "--w-rjv-line-color": "#bdc3c7", // Soft grey for lines, subtle
  "--w-rjv-arrow-color": "#3498db", // Bright blue for arrows, eye-catching
  "--w-rjv-edit-color": "#3498db", // Same blue for edit interactions
  "--w-rjv-info-color": "#95a5a6", // Soft grey for informational text, unobtrusive
  "--w-rjv-update-color": "#2980b9", // Consistent blue for updates
  "--w-rjv-copied-color": "#3498db", // Blue for the copy action, noticeable
  "--w-rjv-copied-success-color": "#27ae60", // Vivid green for success
  "--w-rjv-curlybraces-color": "#34495e", // Darker grey-blue for structure characters
  "--w-rjv-colon-color": "#34495e", // Same as curly braces for consistency
  "--w-rjv-brackets-color": "#34495e", // Matches curly braces and colons
  "--w-rjv-ellipsis-color": "#95a5a6", // Light grey for ellipsis, not too prominent
  "--w-rjv-quotes-color": "#3498db", // Blue for quotes, matching arrows
  "--w-rjv-quotes-string-color": "#e67e22", // Orange for string values, distinct
  "--w-rjv-type-string-color": "#e67e22", // Orange for string types, very distinct
  "--w-rjv-type-int-color": "#c0392b", // Strong red for integers, stands out
  "--w-rjv-type-float-color": "#c0392b", // Same red for floats, consistency
  "--w-rjv-type-bigint-color": "#c0392b", // Red for big integers, uniform look
  "--w-rjv-type-boolean-color": "#3498db", // Blue for booleans, matches key themes
  "--w-rjv-type-date-color": "#2980b9", // Blue for dates, easily recognizable
  "--w-rjv-type-url-color": "#2980b9", // Consistent blue for URLs
  "--w-rjv-type-null-color": "#95a5a6", // Grey for null, neutral and soft
  "--w-rjv-type-nan-color": "#e67e22", // Orange for NaN, unique and distinct
  "--w-rjv-type-undefined-color": "#95a5a6", // Grey for undefined, matching null
};
