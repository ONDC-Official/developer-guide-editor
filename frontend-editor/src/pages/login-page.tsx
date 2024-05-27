import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/mini-ui/card";
import FullPageLoader from "../components/loader";

import axios from "axios";
import React, { useContext, useState } from "react";
import { FaGithub } from "react-icons/fa";
import { MdInfoOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Label } from "../components/ui/mini-ui/label";

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
        localStorage.setItem("orignalRepoLink", repoLink);
        navigate("/home");
      }
    } catch {
      toast.error("Error initializing repository");
    }
    setLoading(false);
  };

  return (
    <div className="bg-gray-200 p-4 h-screen">
      <Card className="mx-auto max-w-sm bg-white bg-opacity-20 backdrop-blur-md p-6 rounded-lg shadow-lg mt-28">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl md:text-3xl lg:text-3xl font-bold text-transparent bg-clip-text flex-grow bg-blue-500 mb-4">
            Login
          </CardTitle>
          <CardDescription>
            Enter git details below to login to your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="username"
                className=" text-lg md:text-m lg:text-m font-bold text-transparent bg-clip-text flex-grow bg-blue-500"
              >
                GIT USERNAME
              </label>
              <input
                type="text"
                id="username"
                name="username"
                className="w-full items-center space-x-2 text-blue-900 font-semibold bg-blue-50 py-2 px-4 rounded border border-blue-200 transition duration-150 ease-in-out focus-within:ring-2 focus-within:ring-blue-700 focus-within:ring-opacity-50 shadow-sm"
                required
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="token"
                className="text-lg  md:text-m lg:text-m font-bold text-transparent bg-clip-text flex-grow bg-blue-500"
              >
                GIT PAT TOKEN:
                <button
                  className=" hover:bg-grey-700 text-black font-bold p-1"
                  onClick={() =>
                    window.open(
                      "https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens"
                    )
                  }
                >
                  <MdInfoOutline
                    className="inline-block text-sm text-blue-500"
                    size={20}
                  />
                </button>
              </label>
              <input
                type="token"
                id="token"
                name="token"
                className="w-full items-center space-x-2 text-blue-900 font-semibold bg-blue-50 py-2 px-4 rounded border border-blue-200 transition duration-150 ease-in-out focus-within:ring-2 focus-within:ring-blue-700 focus-within:ring-opacity-50 shadow-sm"
                required
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="token"
                className="text-lg  md:text-m lg:text-m font-bold text-transparent bg-clip-text flex-grow bg-blue-500"
              >
                REPO LINK (WITHOUT .GIT):
              </label>
              <input
                type="url"
                id="repoLink"
                name="repoLink"
                className="w-full items-center space-x-2 text-blue-900 font-semibold bg-blue-50 py-2 px-4 rounded border border-blue-200 transition duration-150 ease-in-out focus-within:ring-2 focus-within:ring-blue-700 focus-within:ring-opacity-50 shadow-sm"
                required
                onChange={handleInputChange}
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
        </CardContent>
      </Card>
      {loading && <FullPageLoader />}
    </div>
  );
}

export default GitLogin;
