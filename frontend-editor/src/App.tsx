import "./App.css";
import React, { useEffect, useState } from "react";
import { OndcTitle } from "./components/title";
import GitLogin from "./pages/login-page";
import { HomePage } from "./pages/home-page";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { ImSun } from "react-icons/im";
import { FaMoon } from "react-icons/fa";
function App() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/login");
  }, []);
  const [darkMode, setDarkMode] = useState(false);
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  return (
    <>
      <div className={darkMode ? "dark" : ""}>
        <OndcTitle>
          {/* <button
            onClick={toggleDarkMode}
            className="bg-gradient-to-r from-gray-200 to-gray-400 dark:from-gray-600 dark:to-gray-800 p-2 rounded-full shadow-md hover:shadow-lg transition duration-300 ease-in-out"
          >
            {darkMode ? <FaMoon size={18} /> : <ImSun size={18} />}
          </button> */}
        </OndcTitle>
        <Routes>
          <Route path="/login" element={<GitLogin />} />
          <Route path="/home" element={<HomePage />} />
        </Routes>
        <ToastContainer
          position="bottom-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss={false}
          draggable
          pauseOnHover={false}
          theme="colored"
        />
      </div>
    </>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
