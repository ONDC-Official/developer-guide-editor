import FullPageLoader from "../components/loader";

import axios from "axios";
import React, { useContext, useState } from "react";
import { FaGithub } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function GitLogin() {
  const [username, setUsername] = useState("");
  const [repoLink, setRepoLink] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    if (name === "username") {
      setUsername(value);
    } else if (name === "repoLink") {
      setRepoLink(value);
    } else if (name === "token") {
      setToken(value);
    }
  };
  console.log(loading);
  const handleLogin = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const res = await axios.post("http://localhost:1000/git/init", {
        username: username,
        repoUrl: repoLink,
        token: token,
      });
      if (res.status === 200) {
        localStorage.setItem("username", username);
        localStorage.setItem("repoLink", res.data);
        navigate("/home");
      }
    } catch {
      toast.error("Error initializing repository");
    }
    setLoading(false);
  };

  return (
    <>
      <div className="flex justify-center items-center h-screen mt-4">
        <div className="bg-gray-200 p-8 rounded shadow">
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              GIT USERNAME:
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={handleInputChange}
              className="shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="token"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              GIT PAT TOKEN:
            </label>
            <input
              type="token"
              id="token"
              name="token"
              value={token}
              onChange={handleInputChange}
              className="shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="repoLink"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              LINK TO REPO:
            </label>
            <input
              type="url"
              id="repoLink"
              name="repoLink"
              value={repoLink}
              onChange={handleInputChange}
              className="shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 flex items-center"
            onClick={handleLogin}
          >
            <FaGithub className="mr-2" />
            Submit
          </button>
        </div>
      </div>
      {loading && <FullPageLoader />}
    </>
  );
}

export default GitLogin;
