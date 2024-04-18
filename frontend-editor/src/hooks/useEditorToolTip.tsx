import { useState, useCallback, useEffect, useRef } from "react";
import "tippy.js/animations/perspective-subtle.css";
import EditorToolTip from "../components/ui/editor-tool-tip";
interface TooltipProps {
  content: JSX.Element;
  hideOnClick: boolean;
  visible: boolean;
  interactive: boolean;
  onContextMenu: (event: React.MouseEvent) => void;
  onClickOutside: () => void;
  placement: any;
  popperOptions: any;
  getReferenceClientRect: any;
  followCursor: boolean;
  animation: any;
  onMouseEnter: any;
  onMouseLeave: any;
  hover: boolean;
  data: any;
}
export default function useEditorToolTip() {
  const [visible, setVisible] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [hover, setHover] = useState(false);
  const data = useRef("NAN");
  const handleContextMenu = (event: any) => {
    event.preventDefault(); // Prevent the default context menu
    event.stopPropagation(); // Prevent the event from bubbling up
    setCursorPos({ x: event.clientX, y: event.clientY }); // Capture the cursor position
    setVisible(true); // Show the tooltip
  };

  const handleBodyClick = (event: any) => {
    if (!event.target.closest(".tippy-box")) {
      setVisible(false);
    }
  };

  useEffect(() => {
    document.body.addEventListener("click", handleBodyClick);
    return () => {
      document.body.removeEventListener("click", handleBodyClick);
    };
  }, []);

  const handleClickOutside = () => {
    console.log("click outside");
    setVisible(false); // Hide the tooltip on outside click
  };

  const onPlace = () => ({
    width: 0,
    height: 0,
    top: cursorPos.y,
    bottom: cursorPos.y,
    left: cursorPos.x,
    right: cursorPos.x,
    x: cursorPos.x,
    y: cursorPos.y,
    toJSON: () => null,
  });
  return {
    data: data,
    content: <EditorToolTip data={data.current} />,
    visible: visible,
    interactive: true,
    onContextMenu: handleContextMenu,
    onClickOutside: handleClickOutside,
    placement: "right-start",
    animation: "perspective-subtle",
    followCursor: true,
    popperOptions: {
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
    },
    getReferenceClientRect: onPlace,
    onMouseEnter: (e: any) => {
      e.stopPropagation();
      setHover(true);
    },
    onMouseLeave: (e: any) => {
      e.stopPropagation();
      setHover(false);
    },
    hover: hover,
  } as TooltipProps;
}
