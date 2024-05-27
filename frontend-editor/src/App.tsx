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
import { BiPlayCircle } from "react-icons/bi";
import LoadingButton from "./components/ui/loadingButton";
import { sendBuildRequest } from "./utils/requestUtils";
import { MdEdit, MdEditOff } from "react-icons/md";
import { GlobalEditMode, ToggleLocalEditMode } from "./utils/config";

function App() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/login");
  }, []);
  const [darkMode, setDarkMode] = useState(false);
  const [editState, setEditState] = useState(true);
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  const buildGuide = async () => {
    console.log("Building guide");
    const response = await sendBuildRequest();
    console.log("Response", response);
  };
  function GetToggleIcon() {
    if (editState) {
      return <MdEdit size={30} />;
    }
    return <MdEditOff size={30} />;
  }

  return (
    <>
      <div className={darkMode ? "dark" : ""}>
        <OndcTitle>
          <LoadingButton onClick={buildGuide} buttonText="BUILD" />
          <span style={{ marginRight: "10px" }}></span>
          {GlobalEditMode && (
            <button
              onClick={() => setEditState((s) => !s)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold w-20 h-20 p-2 flex items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <GetToggleIcon />
            </button>
          )}
          {/* <LoadingButton onClick={waitOneSecond} buttonText="RAISE PR" /> */}
        </OndcTitle>

        <Routes>
          <Route path="/login" element={<GitLogin />} />
          <Route path="/home" element={<HomePage editMode={editState} />} />
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
