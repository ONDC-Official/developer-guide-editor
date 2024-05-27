import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "./mini-ui/card";
import { Label } from "./mini-ui/label";
import { useEffect, useRef, useState } from "react";
import FullPageLoader from "../loader";
export function LoginCard() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [wrongState, setWrongState] = useState(false);
  const [loading, setLoading] = useState(false);
  const errorMessage = useRef("");

  // Function to handle form submission
  const handleSubmit = async (event: any) => {
    event.preventDefault(); // Prevent the default form submission behavior
    try {
      setLoading(true);
      const token = "OK";
      if (token === "OK") {
        // router.push("/home");
      } else {
        errorMessage.current = "Invalid username or password";
        setWrongState(true);
      }
      setLoading(false);
    } catch (e: any) {
      errorMessage.current = e.message;
      setWrongState(true);
      setLoading(false);
    }
  };

  return (
    <>
      <Card className="mx-auto max-w-sm dark:bg-white bg-opacity-20 backdrop-blur-md p-6 rounded-lg shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle
            className="text-3xl md:text-3xl lg:text-3xl font-bold text-transparent bg-clip-text flex-grow"
            style={{
              backgroundImage: "linear-gradient(to right, #007CF0, #00DFD8)",
            }}
          >
            Login
          </CardTitle>
          <CardDescription>
            Enter your username below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className=" text-lg md:text-m lg:text-m font-bold text-transparent bg-clip-text flex-grow"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, #007CF0, #00DFD8)",
                }}
              >
                Username
              </Label>
              <input
                id="email"
                className="w-full items-center space-x-2 text-blue-900 font-semibold bg-blue-50 py-2 px-4 rounded border border-blue-200 transition duration-150 ease-in-out focus-within:ring-2 focus-within:ring-blue-700 focus-within:ring-opacity-50 shadow-sm"
                required
                type="email"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="relative space-y-2">
              <div className="flex items-center">
                <Label
                  htmlFor="password"
                  className="text-lg  md:text-m lg:text-m font-bold text-transparent bg-clip-text flex-grow"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, #007CF0, #00DFD8)",
                  }}
                >
                  Password
                </Label>
              </div>
              <input
                id="password"
                required
                type="password"
                className="w-full items-center space-x-2 text-blue-900 font-semibold bg-blue-50 py-2 px-4 rounded border border-blue-200 transition duration-150 ease-in-out focus-within:ring-2 focus-within:ring-blue-700 focus-within:ring-opacity-50 shadow-sm"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="relative space-y-2">
              <div className="flex items-center">
                <Label
                  htmlFor="password"
                  className="text-lg  md:text-m lg:text-m font-bold text-transparent bg-clip-text flex-grow"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, #007CF0, #00DFD8)",
                  }}
                >
                  Environment
                </Label>
              </div>
            </div>
            <button
              className=" w-full bg-blue-500 hover:bg-blue-400 text-white font-semibold py-2 px-4 rounded transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-opacity-50 shadow-md"
              type="submit"
              onClick={handleSubmit}
            >
              Login
            </button>
            {wrongState ? (
              <CardDescription className="dark:text-red-500">
                {errorMessage.current}
              </CardDescription>
            ) : (
              <></>
            )}
          </div>
        </CardContent>
      </Card>
      {loading && <FullPageLoader />}
    </>
  );
}
