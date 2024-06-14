import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useContext,
} from "react";
import "tippy.js/animations/perspective-subtle.css";
import EditorToolTip from "../components/ui/editor-tool-tip";
import { Editable } from "../components/file-structure";
import { GlobalEditMode } from "../utils/config";
import { AppContext } from "../context/AppContext";
interface TippyProps {
  content: JSX.Element;
  hideOnClick: boolean;
  visible: boolean;
  interactive: boolean;
  onClickOutside: () => void;
  placement: any;
  popperOptions: any;
  getReferenceClientRect: any;
  animation: any;
}

interface TooltipProps {
  data: React.MutableRefObject<Editable>;
  setButtonStates: VoidFunction;
  onContextMenu: (event: React.MouseEvent) => void;
  followCursor: boolean;
  onMouseOver: any;
  onMouseOut: any;
  hover: boolean;
  tippyProps?: TippyProps;
}

export default function useEditorToolTip(buttonStates = [true, true, true]) {
  if (!GlobalEditMode) {
    buttonStates = [false, false, false];
  }
  const [visible, setVisible] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [hover, setHover] = useState(false);
  const data = useRef<Editable>(null);

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
    onContextMenu: handleContextMenu,
    followCursor: true,
    onMouseOver: (e: any) => {
      e.stopPropagation();
      setHover(true);
    },
    onMouseOut: (e: any) => {
      e.stopPropagation();
      setHover(false);
    },
    hover: hover,
    tippyProps: {
      content: (
        <EditorToolTip
          data={data.current}
          showEdit={buttonStates[0]}
          showAdd={buttonStates[1]}
          showDelete={buttonStates[2]}
          setButtonStates={() => setVisible(false)}
        />
      ),
      visible: visible,
      interactive: true,
      onClickOutside: handleClickOutside,
      placement: "right-start",
      animation: "perspective-subtle",
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
    },
  } as TooltipProps;
}
