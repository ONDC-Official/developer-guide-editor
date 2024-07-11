import React, { useEffect } from "react";
import mermaid from "mermaid";

export interface MermaidProps {
  chartDefinition: string;
  keys: string;
}

export const MermaidDiagram: React.FC<MermaidProps> = ({
  chartDefinition,
  keys,
}) => {
  // return <></>;
  // try {
  console.log(
    mermaid.parse(chartDefinition, { suppressErrors: true }),
    "is mermaid parse"
  );
  console.log(chartDefinition, "is chart definition");
  const ref = React.useRef<HTMLDivElement>(null);
  const [loadState, setLoadState] = React.useState("loading");
  useEffect(() => {
    mermaid
      .parse(chartDefinition)
      .then((res) => {
        mermaid.mermaidAPI.initialize({
          startOnLoad: true,
          securityLevel: "loose",
          logLevel: 5,
        });
        console.log("mermaid initialized");
        setLoadState("initialized");
      })
      .catch((err) => {
        console.log(err);
        setLoadState("error");
      });
    // if (!mermaid.parse(chartDefinition, { suppressErrors: true })) return;
  }, []);

  useEffect(() => {
    if (loadState !== "initialized") return;
    console.log("mermaid rendering");
    mermaid
      .parse(chartDefinition)
      .then((res) => {
        if (ref.current && chartDefinition !== "") {
          mermaid.render(`preview${keys}`, chartDefinition).then((res) => {
            ref.current?.appendChild;
            var mermaidPane = document.createElement("description-mermaid");
            mermaidPane.innerHTML = res.svg;
            ref?.current?.appendChild(mermaidPane);
          });
          console.log("mermaid rendered");
          setLoadState("loaded");
        }
      })
      .catch((err) => {
        console.log(err);
        setLoadState("error");
      });
  }, [chartDefinition, keys, loadState]);
  if (loadState === "loading")
    return (
      <>
        <span>LOADING MERMAID...</span>
      </>
    );
  if (loadState === "error")
    return (
      <>
        <span>INVALID MERMAID PROVIDED!</span>
      </>
    );
  return <div key={keys} ref={ref} />;
  // } catch (err) {
  //   console.log(err);
  //   return <></>;
  // }
};
