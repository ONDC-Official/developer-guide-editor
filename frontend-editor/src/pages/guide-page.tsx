import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
// import "./markdown.css";
import "github-markdown-css/github-markdown-light.css";
const back_end = import.meta.env.VITE_BACKEND;
const GuidePage: React.FC = () => {
  const [guide, setGuide] = useState<string>("");
  useEffect(() => {
    fetch(`${back_end}/helper/userGuide`)
      .then((response) => {
        return response.text();
      })
      .then((text) => {
        setGuide(text);
      });
  }, []);
  return (
    <>
      <div className=" p-2 rounded-md bg-white">
        {/* <div className=" p-"> */}
        <div className="markdown-body mt-20">
          <ReactMarkdown>{guide}</ReactMarkdown>
          {/* </div> */}
        </div>
      </div>
    </>
  );
};

export default GuidePage;
