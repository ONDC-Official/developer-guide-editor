import React, { useState } from "react";
import { FaGithub } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";

function GitLogin() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (event:any) => {
    const { name, value } = event.target;
    if (name === 'username') {
      setUsername(value);
    } else if (name === 'email') {
      setEmail(value);
    } else if (name === 'token') {
      setToken(value);
    }
  };

  const handleLogin = () => {
    // Here you can add logic for login, like API call
    alert(`Username: ${username}\nEmail: ${email}\nToken: ${token}`);
    navigate("/home");
  };

  return (
    <div className="flex justify-center items-center h-screen mt-4">
      <div className="bg-gray-200 p-8 rounded shadow">
        <p className="text-center mb-4">
          {false ? "User is logged in" : "User is not logged in"}
        </p>
        
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
            Username:
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="token" className="block text-gray-700 text-sm font-bold mb-2">
            token:
          </label>
          <input
            type="token"
            id="token"
            name="token"
            value={token}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
          onClick={handleLogin}
        >
          <FaGithub className="mr-2" />
          Submit
        </button>
      </div>
    </div>
  );
}

export default GitLogin;
