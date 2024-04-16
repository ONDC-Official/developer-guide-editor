import React, { useState } from "react";

const d = ["Attributes", "enums", "flows"]; // Sample data

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
  return (
    <div className="flex h-full">
      <div className="mt-3 w-64 h-full overflow-y-auto shadow-lg">
        <ul className="mt-2">
          {data.map((item, index) => (
            <li key={item + index} className="px-2 py-2">
              <button
                key={item} // Replace `item` with your specific key or identifier
                onClick={() => handleTabClick(item)} // Ensure you have defined `setActiveTab`
                className={tabClass(activeTab === item)} // Adjust `activeTab` check as per your state management
              >
                {/* <h2 className="font-bold text-center text-transparent bg-clip-text"> */}
                {item.toUpperCase()}
                {/* </h2> */}
              </button>
            </li>
          ))}
        </ul>
        <button
          className="mt-4 w-full bg-blue-500 text-white py-2 text-base font-medium text-center rounded transition duration-150 ease-in-out hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 active:bg-blue-800"
          onClick={addNewTab}
        >
          ADD GUIDE
        </button>
      </div>
    </div>
  );
};

export default FileStructureSidebar;

{
  /* <h1
className="font-bold text-center text-transparent bg-clip-text flex-grow"
style={{
  fontSize: "1.3rem",
  backgroundImage: "linear-gradient(to right, #007CF0, #00DFD8)",
}}
>
AVAILABLE GUIDES
</h1> */
}
