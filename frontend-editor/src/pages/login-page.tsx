import React, { useState } from "react";

function GitLogin({ loggedIn, setLoggedIn }: any) {
  //   const [loggedIn, setLoggedIn] = useState(false);
  const handleLogin = () => {
    setLoggedIn(true);
  };
  return (
    <div className="flex justify-center items-center h-screen mt-4">
      <div className="bg-gray-200 p-8 rounded shadow">
        <p className="text-center mb-4">
          {loggedIn ? "User is logged in" : "User is not logged in"}
        </p>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleLogin}
        >
          Log In
        </button>
      </div>
    </div>
  );
}

export default GitLogin;
