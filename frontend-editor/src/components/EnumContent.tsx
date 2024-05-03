import React, { useRef } from "react";
import { Editable } from "./file-structure";
import { Disclosure, Transition } from "@headlessui/react";
import { IoIosArrowDropdown, IoIosArrowDropright } from "react-icons/io";
import { CgMenuMotion } from "react-icons/cg";
import { GoRelFilePath } from "react-icons/go";
import { getData } from "../utils/requestUtils";
import useEditorToolTip from "../hooks/useEditorToolTip";
import Tippy from "@tippyjs/react";
import Dropdown from "./horizontal-tab";

interface Enum {
  code: string;
  description: string;
}
interface EnumData {
  path: string;
  enums: Enum[];
}
type EnumResponse = Record<string, EnumData[]>;

export function EnumFolderContent({ enumFolder }: { enumFolder: Editable }) {
  const [folderData, setFolderData] = React.useState<string[]>([]);
  const [selectedFolder, setSelectedFolder] = React.useState<string>();
  const reRender = useRef(false);
  async function getEnumFolder() {
    const data = await getData(enumFolder.path);
    setFolderData(data);
    reRender.current = !reRender.current;
  }
  enumFolder.query.getData = getEnumFolder;
  React.useEffect(() => {
    getEnumFolder();
  }, []);
  const FolderEditable: Editable = {
    name: selectedFolder ?? "",
    path: enumFolder.path + "/" + selectedFolder,
    registerID: "ENUM_FILE",
    query: {
      getData: getEnumFolder,
      Parent: enumFolder.query.Parent,
      updateParams: { oldName: selectedFolder },
    },
  };
  const EnumEditable: Editable = {
    name: selectedFolder ?? "",
    path: enumFolder.path + "/" + selectedFolder,
    registerID: "ENUM_FILE",
    query: {
      Parent: enumFolder,
      getData: async () => {
        console.log("hello");
      },
    },
  };

  return (
    <div className="mt-3 ml-3 max-w-full">
      {/* <div className="flex w-full"> */}
      <div className="flex-1">
        <Dropdown
          items={folderData}
          selectedItem={selectedFolder ?? ""}
          setSelectedItem={setSelectedFolder}
          onOpen={getEnumFolder}
          editable={FolderEditable}
        />
      </div>
      {selectedFolder && selectedFolder !== "" && (
        <EnumContent enums={EnumEditable} reRender={reRender.current} />
      )}
      {/* </div> */}
    </div>
  );
}

export function EnumContent({
  enums,
  reRender,
}: {
  enums: Editable;
  reRender: boolean;
}) {
  const [enumData, setEnumData] = React.useState<EnumResponse>();

  async function getEnumsData() {
    const data = await getData(enums.path);
    setEnumData(data);
  }
  enums.query.getData = getEnumsData;
  React.useEffect(() => {
    getEnumsData();
  }, [enums.name, reRender]);

  return (
    <>
      <div className="mt-2 max-w-full">
        <div className="flex w-full">
          <div className="flex-1">
            {enumData &&
              Object.keys(enumData).map((apiName, index) => (
                <EnumDisclose
                  key={index}
                  apiName={apiName}
                  data={enumData[apiName]}
                  enumEditable={enums}
                />
              ))}
          </div>
        </div>
      </div>
    </>
  );
}

function EnumDisclose({
  apiName,
  data,
  enumEditable,
}: {
  apiName: string;
  data: EnumData[];
  enumEditable: Editable;
}) {
  const apiToolTip = useEditorToolTip();

  const apiEidtable = { ...enumEditable };
  apiEidtable.name = apiName;
  apiEidtable.query = {
    getData: enumEditable.query.getData,
    Parent: enumEditable,
    addParams: { type: "enum" },
    deleteParams: {},
    updateParams: { oldName: apiName },
  };
  if (apiEidtable.query.deleteParams) {
    apiEidtable.query.deleteParams[apiName] = JSON.stringify([]);
  }
  apiToolTip.data.current = apiEidtable;

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
                <EnumList
                  key={i}
                  enumData={t}
                  index={i}
                  enumEditable={apiEidtable}
                />
              ))}
              {data.length === 0 && <div>No Enums</div>}
            </Disclosure.Panel>
          </DropTransition>
        </>
      )}
    </Disclosure>
  );
}

function EnumList({
  enumData,
  index,
  enumEditable,
}: {
  enumData: EnumData;
  index: number;
  enumEditable: Editable;
}) {
  const enumToolTip = useEditorToolTip([true, false]);
  const editable: Editable = {
    name: enumData.path.split(".").pop() || "",
    path: enumEditable.path,
    registerID: enumEditable.registerID,
    query: {
      getData: enumEditable.query.getData,
      Parent: enumEditable,
      addParams: { type: "enum" },
      deleteParams: {},
      updateParams: {},
    },
  };
  if (editable.query.deleteParams) {
    editable.query.deleteParams[enumEditable.name] = [
      { path: enumData.path, enums: enumData.enums },
    ];
  }
  if (editable.query.updateParams) {
    editable.query.updateParams = {
      path: enumData.path,
      enums: enumData.enums,
    };
  }
  enumToolTip.data.current = editable;
  return (
    <Disclosure key={index}>
      <Disclosure.Button
        className="flex ml-6 mt-1 w-full px-4 py-2 text-base font-medium text-left text-black bg-gray-200 hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75 shadow-md hover:shadow-lg"
        onContextMenu={enumToolTip.onContextMenu}
      >
        <Tippy {...enumToolTip.tippyProps}>
          <div className="flex items-center">
            <GoRelFilePath size={20} className="mr-2" />
            <span>{enumData.path}</span>
          </div>
        </Tippy>
      </Disclosure.Button>
      <Disclosure.Panel>
        <div className="ml-6 p-2 shadow-inner">
          <EnumTable enumList={enumData.enums} />
        </div>
      </Disclosure.Panel>
    </Disclosure>
  );
}

function EnumTable({ enumList }: { enumList: Enum[] }) {
  enumList = enumList.map((e) => {
    const ob = { code: e.code, description: e.description };
    return ob;
  });
  const heads = ["code", "description"];
  return (
    <>
      <table className="w-full border-collapse table-auto">
        <thead>
          <tr>
            {heads.map((key, index) => (
              <th
                key={index}
                className="px-4 py-2 text-left border-b-2 border-gray-200 text-base"
                // style={{ minWidth: "100px", maxWidth: "200px" }}
              >
                {key.toUpperCase()}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {enumList.map((e, index) => (
            <tr key={index}>
              {Object.values(e)
                .filter((val) => val != "refrence")
                .map((value, i) => (
                  <td
                    key={i + value}
                    className="px-4 py-2 text-left border-b border-gray-200 align-top break-words text-base"
                  >
                    {value}
                  </td>
                ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

function DropTransition({ children }: any) {
  return (
    <Transition
      enter="transition duration-200 ease-out"
      enterFrom="transform translate-y-1 opacity-0"
      enterTo="transform translate-y-0 opacity-100"
      leave="transition duration-150 ease-in"
      leaveFrom="transform translate-y-0 opacity-100"
      leaveTo="transform translate-y-1 opacity-0"
    >
      {children}
    </Transition>
  );
}
