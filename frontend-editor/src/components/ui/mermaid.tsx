import React, { useEffect } from "react";
import mermaid from "mermaid";

export interface MermaidProps {
  chartDefinition: string;
  keys: string;
}

export const MermaidDiagram: React.FC<MermaidProps> = ({ chartDefinition, keys }) => {
  try{
  console.log(chartDefinition, "is chart definition");
  const ref = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      securityLevel: "loose",
      // theme: "forest",
      logLevel: 5
    });

  }, []);

  useEffect(() => {
    if (ref.current && chartDefinition !== "") {
      mermaid.render(`preview${keys}`, chartDefinition).then((res)=>{
      // @ts-ignore
      ref.current.appendChild
        var mermaidPane = document.createElement("description-mermaid");
        mermaidPane.innerHTML = res.svg
        ref?.current?.appendChild(mermaidPane)
      })
    }
  }, [chartDefinition, keys]);

  return <div key={keys} ref={ref} />;
}
catch(err){
  console.log(err)
}
};
