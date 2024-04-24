import Tippy from "@tippyjs/react";
import useEditorToolTip from "../hooks/useEditorToolTip";
import React, { useContext, useState } from "react";
import { CompFolderID, CompFolderName } from "../pages/home-page";
import { DataContext } from "../context/dataContext";
const d = [""]; // Sample data

export interface Editable {
  name: string;
  registerID: string;
  path: string;
  query?: any;
}

interface ComponentsStructureProps {
  components: Editable[];
}

export const ComponentsStructure = ({
  components,
}: ComponentsStructureProps) => {
  const dataContext = useContext(DataContext);
  const handleTabClick = (item: Editable) => {
    dataContext.setActiveEditable(item);
  };
  console.log(components);
  const tooltip = useEditorToolTip();
  tooltip.data.current = {
    name: CompFolderName,
    registerID: CompFolderID,
    path: "cpo",
  } as Editable;

  if (!components) return <></>;
  return (
    <div
      className={`flex flex-col h-screen w-64 hover:bg-blue-100 fixed left-0 z-50 top-20`}
      onContextMenu={tooltip.onContextMenu}
    >
      <Tippy {...tooltip.tippyProps}>
        <div className="mt-3 w-64 h-full overflow-y-auto shadow-lg">
          <ul className="mt-2">
            {components.map((item, index) => (
              <Tab
                key={item.name + index}
                item={item}
                index={index}
                activeTab={dataContext.acitiveEditable}
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
  const tooltip = useEditorToolTip();
  const thisItem = item as Editable;
  tooltip.data.current = thisItem;
  return (
    <div
      onContextMenu={tooltip.onContextMenu}
      onMouseOver={tooltip.onMouseOver}
      onMouseOut={tooltip.onMouseOut}
    >
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
        : "text-black hover:bg-blue-100 hover:text-blue-800 scale-100" // Improved hover state
    }
    active:bg-blue-300 shadow-blue-400
  `;
