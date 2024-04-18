import { useState } from "react";

const useHover = () => {
  const [isHovered, setIsHovered] = useState(false);
  const bind = {
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
  };

  return [isHovered, bind];
};

export default useHover;
