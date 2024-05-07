import { useRef, useState } from "react";
import { Editable } from "./file-structure";
import { getData } from "../utils/requestUtils";
import React from "react";
import { TagFileID, TagFolderID } from "../pages/home-page";
import Dropdown from "./horizontal-tab";
import { Disclosure } from "@headlessui/react";
import useEditorToolTip from "../hooks/useEditorToolTip";
import Tippy from "@tippyjs/react";
import { CgMenuMotion } from "react-icons/cg";
import { IoIosArrowDropdown, IoIosArrowDropright } from "react-icons/io";
import { DropTransition } from "./helper-components";
import { IoLayersOutline } from "react-icons/io5";
import { VscJson } from "react-icons/vsc";
import path from "path";
export interface Tag {
  code: string;
  description: string;
  required: string;
  list: {
    code: string;
    description: string;
  }[];
}

export interface TagData {
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
      addParams: { formType: "addAPI" },
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
    registerID: TagFileID,
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
  }, [tags.name, reRender]);

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
              {data.length === 0 && <div>No Tag Groups</div>}
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
      addParams: {
        formType: "addTagGroup",
        tagPath: tagData.path,
        apiName: tagEditable.name,
      },
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
      { path: tagData.path, tags: tagData.tag, type: "tagGroup" },
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
            <VscJson size={20} className="mr-2" />
            <span>{tagData.path}</span>
          </div>
        </Tippy>
      </Disclosure.Button>
      <Disclosure.Panel>
        <div className="ml-6 p-1 shadow-inner">
          {tagData.tag.map((tag, index) => (
            <TagGroupInfo key={index} tag={tag} editable={editable} />
          ))}
        </div>
        {tagData.tag.length === 0 && <div className="ml-8">No Tags</div>}
      </Disclosure.Panel>
    </Disclosure>
  );
}

function TagGroupInfo({ tag, editable }: { tag: Tag; editable: Editable }) {
  const toolTip = useEditorToolTip();
  const tagPath = editable.query.addParams?.tagPath;
  const tagAPI = editable.query.addParams?.apiName;
  const tagEditable: Editable = {
    name: tag.code,
    path: editable.path,
    deletePath: editable.path,
    registerID: editable.registerID,
    query: {
      Parent: editable,
      getData: editable.query.getData,
      updateParams: { tags: tag.list },
      addParams: {
        formType: "addTag",
        tagPath: tagPath,
        tagCode: tag.code,
        tagDescription: tag.description,
        tagRequired: tag.required,
        apiName: tagAPI,
      },
      deleteParams: {},
      copyData: async () => {
        const copyData: Record<string, TagData[]> = {};
        copyData[tagAPI] = [{ path: tagPath, tag: [tag] }];
        return JSON.stringify(copyData, null, 2);
      },
    },
  };
  if (tagEditable.query.deleteParams) {
    tagEditable.query.deleteParams[tagAPI] = [
      { path: tagPath, tag: [tag], type: "tag" },
    ];
  }
  toolTip.data.current = tagEditable;
  if (!tag.list) return <h2>Invalid Tag Format!</h2>;
  console.log(toolTip.tippyProps);
  return (
    <Disclosure as={"div"}>
      <>
        <Disclosure.Button
          onContextMenu={toolTip.onContextMenu}
          className="flex mt-1 ml-8 w-full px-4 py-2 text-base font-medium text-left text-black bg-blue-100 hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75 shadow-md hover:shadow-lg"
        >
          <Tippy {...toolTip.tippyProps}>
            <div className="flex items-center">
              <IoLayersOutline size={20} className="mr-2 text-blue-500" />
              <span className="text-blue-500">{tag.code}</span>
            </div>
          </Tippy>
        </Disclosure.Button>
        <Disclosure.Panel
          className="ml-8 p-4 bg-blue-50 shadow-md transition duration-300 ease-in-out"
          onContextMenu={toolTip.onContextMenu}
        >
          <div className="mb-4">
            <span className="font-bold">DESCRIPTION:</span>
            <span className="ml-2 ">{tag.description}</span>
          </div>
          <div className="mb-4">
            <span className="font-bold">REQUIRED:</span>
            <span className="ml-2 ">{tag.required}</span>
          </div>
          <div>
            <table className="min-w-full text-base hover:bg-100-200 bg-blue-100">
              <thead>
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
                  <tr key={index} className="border-b">
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
      </>
    </Disclosure>
  );
}
