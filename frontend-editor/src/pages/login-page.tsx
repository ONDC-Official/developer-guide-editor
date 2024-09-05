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
import FolderSelector from "../components/ui/folder-selector";
import { random } from "mermaid/dist/utils.js";

function LoginCard(props: { handleInputChange: any; handleLogin: any }) {
  return (
    <Card className="mx-auto max-w-sm bg-white bg-opacity-20 backdrop-blur-md p-6 rounded-lg shadow-lg mt-28">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl md:text-2xl lg:text-2xl font-bold text-transparent bg-clip-text flex-grow bg-blue-500 mb-4">
          Login
        </CardTitle>
        <CardDescription>
          Enter details below to login to your account
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="username"
              className=" text-lg md:text-m lg:text-m font-bold text-transparent bg-clip-text flex-grow bg-blue-500"
            >
              USERNAME
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="w-full items-center space-x-2 text-blue-900 font-semibold bg-blue-50 py-2 px-4 rounded border border-blue-200 transition duration-150 ease-in-out focus-within:ring-2 focus-within:ring-blue-700 focus-within:ring-opacity-50 shadow-sm"
              required
              onChange={props.handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="token"
              className="text-lg  md:text-m lg:text-m font-bold text-transparent bg-clip-text flex-grow bg-blue-500"
            >
              PASSWORD
              {/* <button
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
              </button> */}
            </label>
            <input
              type="token"
              id="token"
              name="token"
              className="w-full items-center space-x-2 text-blue-900 font-semibold bg-blue-50 py-2 px-4 rounded border border-blue-200 transition duration-150 ease-in-out focus-within:ring-2 focus-within:ring-blue-700 focus-within:ring-opacity-50 shadow-sm"
              required
              onChange={props.handleInputChange}
            />
          </div>
          <button
            className="flex-auto w-full bg-blue-500 hover:bg-blue-400 text-white font-semibold py-2 px-4 rounded transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-opacity-50 shadow-md flex items-center justify-center"
            onClick={props.handleLogin}
          >
            {/* <FaGithub className="mr-2" size={20} /> */}
            Submit
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

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
        localStorage.setItem("secretKey", "Key" + token.slice(0, 5));
        navigate("/home");
      }
    } catch {
      toast.error("Error initializing repository");
    }
    setLoading(false);
  };

  const onSubmit = (data: any) => {
    // dataContext.activePath.current = data.componentName;
    // dataContext.setActivePath(data.componentName);
    navigate("/home");
  };
  return (
    <div className="bg-gray-200 p-4 h-screen">
      <div className="flex items-center">
        <div className="w-1/2 flex justify-center">
          <LoginCard
            handleInputChange={handleInputChange}
            handleLogin={handleLogin}
          />
        </div>
        <div className="flex flex-col items-center mx-4">
          <div className="border-l border-blue-600 h-40"></div>
          <span className="text-2xl font-bold text-blue-500 mx-2">OR</span>
          <div className="border-l border-blue-600 h-40"></div>
        </div>
        <div className="w-1/2 flex justify-center">
          <SignUpCard
            handleInputChange={handleInputChange}
            handleLogin={handleLogin}
          />
        </div>
      </div>
      {loading && <FullPageLoader />}
    </div>
  );
}

export default GitLogin;

function LocalSelector({ onSubmit }: { onSubmit: any }) {
  return (
    <div className="flex flex-col items-center space-y-2 ">
      <FolderSelector afterUpload={onSubmit} />
    </div>
  );
}

function SignUpCard(props: { handleInputChange: any; handleLogin: any }) {
  return (
    <Card className="mx-auto max-w-sm bg-white bg-opacity-20 backdrop-blur-md p-6 rounded-lg shadow-lg mt-28">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl md:text-2xl lg:text-2xl font-bold text-transparent bg-clip-text flex-grow bg-blue-500 mb-4">
          Sign-Up
        </CardTitle>
        <CardDescription>
          Enter details below to create a new account
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="username"
              className=" text-lg md:text-m lg:text-m font-bold text-transparent bg-clip-text flex-grow bg-blue-500"
            >
              USERNAME
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="w-full items-center space-x-2 text-blue-900 font-semibold bg-blue-50 py-2 px-4 rounded border border-blue-200 transition duration-150 ease-in-out focus-within:ring-2 focus-within:ring-blue-700 focus-within:ring-opacity-50 shadow-sm"
              required
              onChange={props.handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="token"
              className="text-lg  md:text-m lg:text-m font-bold text-transparent bg-clip-text flex-grow bg-blue-500"
            >
              PASSWORD
            </label>
            <input
              type="token"
              id="token"
              name="token"
              className="w-full items-center space-x-2 text-blue-900 font-semibold bg-blue-50 py-2 px-4 rounded border border-blue-200 transition duration-150 ease-in-out focus-within:ring-2 focus-within:ring-blue-700 focus-within:ring-opacity-50 shadow-sm"
              required
              onChange={props.handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="token"
              className="text-lg  md:text-m lg:text-m font-bold text-transparent bg-clip-text flex-grow bg-blue-500"
            >
              RE-PASSWORD
            </label>
            <input
              type="token"
              id="token"
              name="token"
              className="w-full items-center space-x-2 text-blue-900 font-semibold bg-blue-50 py-2 px-4 rounded border border-blue-200 transition duration-150 ease-in-out focus-within:ring-2 focus-within:ring-blue-700 focus-within:ring-opacity-50 shadow-sm"
              required
              onChange={props.handleInputChange}
            />
          </div>
          <button
            className="flex-auto w-full bg-blue-500 hover:bg-blue-400 text-white font-semibold py-2 px-4 rounded transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-opacity-50 shadow-md flex items-center justify-center"
            onClick={props.handleLogin}
          >
            {/* <FaGithub className="mr-2" size={20} /> */}
            Submit
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
