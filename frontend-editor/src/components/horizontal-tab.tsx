import React, { useState } from "react";
import Tippy from "@tippyjs/react";
import useEditorToolTip from "../hooks/useEditorToolTip";
import { Editable } from "./file-structure";

const Dropdown = ({
  items,
  setSelectedItem,
  selectedItem,
  onOpen,
  editable,
}: {
  items: string[];
  setSelectedItem: (item: string) => void;
  selectedItem: string;
  onOpen: () => void;
  editable: Editable;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const tooltip = useEditorToolTip();
  tooltip.data.current = editable;
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedItem(event.target.value);
  };

  const handleFocus = () => {
    if (!isOpen) {
      setIsOpen(true);
      onOpen(); // Call onOpen the first time it is opened
    }
  };

  const handleBlur = () => {
    setIsOpen(false);
    onOpen();
  };

  return (
    <div
      className="relative w-3/4"
      onContextMenu={tooltip.onContextMenu}
      onMouseOver={tooltip.onMouseOver}
      onMouseOut={tooltip.onMouseOut}
    >
      <Tippy {...tooltip.tippyProps}>
        <select
          value={selectedItem}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="bg-gray-200 text-gray-800 py-2 px-4 rounded w-full cursor-pointer"
        >
          {selectedItem ? null : <option value="">Select an option</option>}
          {items.map((item, index) => (
            <option key={index} value={item}>
              {item}
            </option>
          ))}
        </select>
      </Tippy>
    </div>
  );
};

export default Dropdown;
