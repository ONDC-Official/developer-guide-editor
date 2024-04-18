import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { useState, useEffect } from "react";
import EditorToolTip from "./editor-tool-tip";

export default function TestButton() {
  const [visible, setVisible] = useState(false);

  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  const handleContextMenu = (event: any) => {
    event.preventDefault(); // Prevent the default context menu
    setCursorPos({ x: event.clientX, y: event.clientY }); // Capture the cursor position
    setVisible(true); // Show the tooltip
  };

  const handleClickOutside = () => {
    setVisible(false); // Hide the tooltip on outside click
  };
  return (
    <div
      onContextMenu={handleContextMenu}
      style={{ width: "100%", height: "100vh", position: "relative" }}
    >
      <Tippy
        content="Right-click menu options"
        visible={visible}
        followCursor={false}
        placement="right-start"
        hideOnClick={true}
        interactive={true}
        onClickOutside={handleClickOutside}
        popperOptions={{
          strategy: "fixed", // Ensures the tooltip is placed based on the fixed position of the cursor
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [0, 10], // Adjust offset from the cursor as needed
              },
            },
            {
              name: "computeStyles",
              options: {
                adaptive: false, // Prevents shifting the tooltip when the cursor moves
                gpuAcceleration: false, // Avoids using transform for positioning (important for precise placement)
              },
            },
          ],
        }}
        getReferenceClientRect={() => ({
          width: 0,
          height: 0,
          top: cursorPos.y,
          bottom: cursorPos.y,
          left: cursorPos.x,
          right: cursorPos.x,
          x: cursorPos.x,
          y: cursorPos.y,
          toJSON: () => null,
        })}
      >
        <button style={{ position: "absolute", top: 0, left: 0, opacity: 0 }}>
          Right Click Me
        </button>
      </Tippy>
    </div>
  );
}
