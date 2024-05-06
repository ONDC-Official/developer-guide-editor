import { useRef, useState } from "react";
import { Editable } from "./file-structure";
import { getData } from "../utils/requestUtils";
import React from "react";
import { TagFolderID } from "../pages/home-page";
import Dropdown from "./horizontal-tab";
import { Disclosure } from "@headlessui/react";
import useEditorToolTip from "../hooks/useEditorToolTip";
import Tippy from "@tippyjs/react";
import { CgMenuMotion } from "react-icons/cg";
import { IoIosArrowDropdown, IoIosArrowDropright } from "react-icons/io";
import { GoRelFilePath } from "react-icons/go";
import { DropTransition } from "./helper-components";

interface Tag {
  code: string;
  description: string;
  required: string;
  list: {
    code: string;
    description: string;
  }[];
}

interface TagData {
  path: string;
  tag: Tag[];
}

type TagResponse = Record<string, TagData[]>;

export function TagsFolderContent({ tagFolder }: { tagFolder: Editable }) {
  const [folderData, setFolderData] = useState<string[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string>();
  const reRender = useRef(false);
  async function getTagFolder() {
    const data = await getData(tagFolder.path);
    setFolderData(data);
    reRender.current = !reRender.current;
    console.log(data);
  }
  tagFolder.query.getData = getTagFolder;
  React.useEffect(() => {
    getTagFolder();
  }, []);

  const FolderEditable: Editable = {
    name: selectedFolder ?? "",
    path: tagFolder.path + "/" + selectedFolder,
    deletePath: tagFolder.path + "/" + selectedFolder,
    registerID: tagFolder.registerID,
    query: {
      getData: getTagFolder,
      Parent: tagFolder.query.Parent,
      updateParams: { oldName: selectedFolder },
      copyData: async () => {
        const data = await getData(tagFolder.path + "/" + selectedFolder);
        return JSON.stringify(data, null, 2);
      },
    },
  };
  const TagEditable: Editable = {
    name: selectedFolder ?? "",
    path: tagFolder.path + "/" + selectedFolder,
    deletePath: tagFolder.path + "/" + selectedFolder,
    registerID: tagFolder.registerID,
    query: {
      Parent: tagFolder,
      getData: async () => {
        console.log("hello");
      },
    },
  };

  return (
    <>
      <div className="mt-3 ml-3 max-w-full">
        <div className="flex-1">
          <Dropdown
            items={folderData}
            selectedItem={selectedFolder ?? ""}
            setSelectedItem={setSelectedFolder}
            onOpen={getTagFolder}
            editable={FolderEditable}
          />
        </div>
        {selectedFolder && selectedFolder !== "" && (
          <TagContent tags={TagEditable} reRender={reRender.current} />
        )}
      </div>
    </>
  );
}

export function TagContent({
  tags,
  reRender,
}: {
  tags: Editable;
  reRender: Boolean;
}) {
  const [tagData, setTagData] = useState<TagResponse>();

  async function getTag() {
    const data = await getData(tags.path);
    setTagData(data);
    reRender = !reRender;
  }
  tags.query.getData = getTag;
  React.useEffect(() => {
    getTag();
  }, [reRender]);

  return (
    <>
      <div className="mt-2 max-w-full">
        <div className="flex w-full">
          <div className="flex-1">
            {tagData &&
              Object.keys(tagData).map((apiName, index) => (
                <TagDisclose
                  key={index}
                  apiName={apiName}
                  data={tagData[apiName]}
                  tagEditable={tags}
                />
              ))}
          </div>
        </div>
      </div>
    </>
  );
}

function TagDisclose({
  apiName,
  data,
  tagEditable,
}: {
  apiName: string;
  data: TagData[];
  tagEditable: Editable;
}) {
  const apiToolTip = useEditorToolTip();

  const apiEditable = { ...tagEditable };
  apiEditable.name = apiName;
  apiEditable.query = {
    getData: tagEditable.query.getData,
    Parent: tagEditable,
    deleteParams: {},
    updateParams: { oldName: apiName },
    copyData: async () => {
      const copyData: Record<string, TagData[]> = {};
      copyData[apiName] = data;
      return JSON.stringify(copyData, null, 2);
    },
  };
  if (apiEditable.query.deleteParams) {
    apiEditable.query.deleteParams[apiName] = JSON.stringify([]);
  }
  apiToolTip.data.current = apiEditable;
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
              {data.map((tag, index) => (
                <AllTagList
                  key={index}
                  tagData={tag}
                  index={index}
                  tagEditable={apiEditable}
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

function AllTagList({
  index,
  tagData,
  tagEditable,
}: {
  index: number;
  tagData: TagData;
  tagEditable: Editable;
}) {
  console.log(tagData);
  const tagToolTip = useEditorToolTip();
  const editable: Editable = {
    name: tagData.path.split(".").pop() ?? "",
    path: tagEditable.path,
    deletePath: tagEditable.path,
    registerID: tagEditable.registerID,
    query: {
      getData: tagEditable.query.getData,
      Parent: tagEditable,
      updateParams: { path: tagData.path, tags: tagData.tag },
      deleteParams: {},
      copyData: async () => {
        const copyData: Record<string, TagData[]> = {};
        copyData[tagEditable.name] = [tagData];
        return JSON.stringify(copyData, null, 2);
      },
    },
  };
  if (editable.query.deleteParams) {
    editable.query.deleteParams[tagEditable.name] = [
      { path: tagData.path, tags: tagData.tag },
    ];
  }
  tagToolTip.data.current = editable;
  if (!tagData.tag) return <></>;
  return (
    <Disclosure key={index}>
      <Disclosure.Button
        className="flex ml-6 mt-1 w-full px-4 py-2 text-base font-medium text-left text-black bg-gray-200 hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75 shadow-md hover:shadow-lg"
        onContextMenu={tagToolTip.onContextMenu}
      >
        <Tippy {...tagToolTip.tippyProps}>
          <div className="flex items-center">
            <GoRelFilePath size={20} className="mr-2" />
            <span>{tagData.path}</span>
          </div>
        </Tippy>
      </Disclosure.Button>
      <Disclosure.Panel>
        <div className="ml-6 p-2 shadow-inner">
          {tagData.tag.map((tag, index) => (
            <TagGroupInfo key={index} tag={tag} />
          ))}
        </div>
      </Disclosure.Panel>
    </Disclosure>
  );
}

function TagGroupInfo({ tag }: { tag: Tag }) {
  if (!tag.list) return <h2>Invalid Tag Format!</h2>;
  return (
    <Disclosure>
      <Disclosure.Button className="flex ml-8 mt-1 w-full px-4 py-2 text-base font-medium text-left text-black bg-blue-100 hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75 shadow-md hover:shadow-lg">
        <div className="flex items-center">
          <span className="text-blue-500">{tag.code}</span>
        </div>
      </Disclosure.Button>
      <Disclosure.Panel className="ml-8 p-4 bg-blue-50 shadow-md">
        <div className="mb-4">
          <span className="font-bold">DESCRIPTION:</span>
          <span className="ml-2 ">{tag.description}</span>
        </div>
        <div className="mb-4">
          <span className="font-bold">REQUIRED:</span>
          <span className="ml-2 ">{tag.required}</span>
        </div>
        <div>
          <table className="min-w-full text-base">
            <thead className="bg-blue-100">
              <tr>
                <th className="text-left font-bold text-blue-700 px-4 py-2">
                  CODE
                </th>
                <th className="text-left font-bold text-blue-700 px-4 py-2">
                  DESCRIPTION
                </th>
              </tr>
            </thead>
            <tbody>
              {tag.list.map((list, index) => (
                <tr key={index} className="bg-blue-100 border-b">
                  <td className="px-4 py-1 text-blue-500 font-semibold">
                    {list.code}:
                  </td>
                  <td className="px-4 py-1 text-blue-500">
                    {list.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Disclosure.Panel>
    </Disclosure>
  );
}
