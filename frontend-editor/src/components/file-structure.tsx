import Tippy from "@tippyjs/react";
import useEditorToolTip from "../hooks/useEditorToolTip";
import React, { useContext, useState } from "react";
import { CompFolderID } from "../pages/home-page";
import { DataContext } from "../context/dataContext";
const d = [""]; // Sample data

export interface EditableQuery {
  getData: () => Promise<any>;
  copyData?: () => Promise<any>;
  Parent: Editable | null;
  addParams?: Record<string, any>;
  deleteParams?: Record<string, any>;
  updateParams?: Record<string, any>;
}

export interface Editable {
  name: string;
  registerID: string;
  path: string;
  query: EditableQuery;
}

interface ComponentsStructureProps {
  componentParent: Editable;
  componentsChildren: Editable[];
}

export const ComponentsStructure = ({
  componentParent,
  componentsChildren,
}: ComponentsStructureProps) => {
  const dataContext = useContext(DataContext);
  const handleTabClick = (item: Editable) => {
    dataContext.setActiveEditable(item);
  };

  const tooltip = useEditorToolTip([false, true, true]);
  tooltip.data.current = componentParent;

  if (!componentsChildren) return <></>;
  return (
    <div
      className={`flex flex-col h-screen w-64 hover:bg-blue-100 fixed left-0 z-50 top-20`}
      onContextMenu={tooltip.onContextMenu}
    >
      <Tippy {...tooltip.tippyProps}>
        <div className="mt-3 w-64 h-full overflow-y-auto shadow-lg">
          <ul className="mt-2">
            {componentsChildren.map((item, index) => (
              <Tab
                key={item.name + index}
                item={item}
                index={index}
                activeTab={dataContext.activeEditable}
                handleTabClick={handleTabClick}
              />
            ))}
          </ul>
        </div>
      </Tippy>
    </div>
  );
};

function Tab({ item, index, activeTab, handleTabClick }: any) {
  const tooltip = useEditorToolTip([false, true, true]);
  const thisItem = item as Editable;
  tooltip.data.current = thisItem;
  return (
    <div onContextMenu={tooltip.onContextMenu} className=" hover:bg-blue-300">
      <Tippy {...tooltip.tippyProps}>
        <li key={thisItem.name + index} className="px-2 py-2">
          <button
            key={item.name + item.registerID}
            onClick={() => handleTabClick(item)}
            className={tabClass(activeTab?.name === item.name)}
          >
            {thisItem?.name.toUpperCase()}
          </button>
        </li>
      </Tippy>
    </div>
  );
}

export default ComponentsStructure;

const tabClass = (isActive: boolean) => `
    block w-full py-2.5 text-sm font-medium leading-5 text-center cursor-pointer
    transform transition duration-150 ease-in-out
    ${
      isActive
        ? "bg-blue-500 text-white shadow-lg scale-110" // More contrast for active tab
        : "text-black hover:bg-blue-100 scale-100" // Improved hover state
    }
    active:bg-blue-300 shadow-blue-400
  `;
