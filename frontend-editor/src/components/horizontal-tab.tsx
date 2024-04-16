import { useState } from "react";

const HorizontalTabBar = () => {
  const data = ["Attributes", "Enums", "Flows"];
  const [activeTab, setActiveTab] = useState(data[0]);

  const handleTabClick = (item: any) => {
    setActiveTab(item);
  };

  const tabClass = (isActive: boolean) => `
    block w-full py-2.5 text-sm font-medium leading-5 text-center cursor-pointer
    transform transition duration-150 ease-in-out
    ${
      isActive
        ? "bg-blue-500 text-white shadow-lg scale-110" // More contrast for active tab
        : "text-black hover:bg-blue-100 hover:text-blue-800 scale-100" // Improved hover state
    }
    active:bg-blue-300
  `;

  return (
    <div className="bg-white shadow-md w-full">
      <ul className="flex justify-start space-x-1 p-2">
        {data.map((item, index) => (
          <li key={item + index} className="flex-1">
            <button
              onClick={() => handleTabClick(item)}
              className={`${tabClass(
                activeTab === item
              )} outline-blue-500 shadow-blue-400 transition-colors ml-1 mr-1`}
            >
              <h2 className="font-bold text-center">{item.toUpperCase()}</h2>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HorizontalTabBar;
