import Tippy from "@tippyjs/react";
import useEditorToolTip from "../hooks/useEditorToolTip";
import React, { useState } from "react";
const d = ["Attributes", "enums", "flows"]; // Sample data

export const FileStructureSidebar = ({
  initialData = d,
  initialActiveTab = d[0],
}) => {
  const [data, setData] = useState(initialData);
  const [activeTab, setActiveTab] = useState(initialActiveTab || data[0]);

  const handleTabClick = (item: any) => {
    setActiveTab(item);
  };

  const addNewTab = () => {
    const newTabName = `Tab ${data.length + 1}`; // Naming new tabs sequentially
    setData([...data, newTabName]); // Adding a new tab to the array
    setActiveTab(newTabName); // Optionally set the new tab as active
  };

  const tooltip = useEditorToolTip();
  tooltip.data.current = "COMPONENTS";
  return (
    <div
      className={`flex h-full ${tooltip.hover ? "bg-blue-100" : ""}`}
      onContextMenu={tooltip.onContextMenu}
      onMouseOver={tooltip.onMouseEnter}
      onMouseOut={tooltip.onMouseLeave}
    >
      <Tippy {...tooltip}>
        <div className="mt-3 w-64 h-full overflow-y-auto shadow-lg">
          <ul className="mt-2">
            {data.map((item, index) => (
              <Tab
                key={item + index}
                item={item}
                index={index}
                activeTab={activeTab}
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
  tooltip.data.current = item.toUpperCase();
  return (
    <div
      onContextMenu={tooltip.onContextMenu}
      onMouseOver={tooltip.onMouseEnter}
      onMouseOut={tooltip.onMouseLeave}
    >
      <Tippy {...tooltip}>
        <li key={item + index} className="px-2 py-2">
          <button
            key={item}
            onClick={() => handleTabClick(item)}
            className={tabClass(activeTab === item)}
          >
            {item.toUpperCase()}
          </button>
        </li>
      </Tippy>
    </div>
  );
}

export default FileStructureSidebar;

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
