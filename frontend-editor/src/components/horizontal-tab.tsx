import React, { useState } from "react";

const HorizontalTapBar = ({ items }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const handleItemClick = (item: any) => {
    setSelectedItem(item);
    setIsOpen(false);
  };
  console.log(items);
  return (
    <div className="relative w-full">
      <button
        onClick={toggleDropdown}
        className="bg-gray-200 text-gray-800 py-2 px-4 rounded inline-flex items-center w-10/12"
      >
        <span>{selectedItem || "Select an option"}</span>
        <svg
          className="fill-current h-4 w-4 ml-2"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          {isOpen ? (
            <path d="M14.707 10.293a1 1 0 01-1.414 0L10 6.101 6.707 9.293a1 1 0 11-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" />
          ) : (
            <path d="M5.293 9.293a1 1 0 011.414 0L10 13.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          )}
        </svg>
      </button>
      {isOpen && (
        <ul className="absolute bg-gray-300 w-full mt-1 rounded z-10">
          {items.map((item: any, index: number) => (
            <li
              key={index}
              className="py-2 px-4 hover:bg-blue-500 hover:text-white cursor-pointer"
              onClick={() => handleItemClick(item)}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
      <button className="bg-blue-500 py-2 px-4 text-white rounded inline-flex items-center ml-2">
        Add
      </button>
    </div>
  );
};

export default HorizontalTapBar;
