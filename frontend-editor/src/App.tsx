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
import { GlobalEditMode } from "./utils/config";
import { AppContext } from "./context/AppContext";
import GuidePage from "./pages/guide-page";

function App() {
  const navigate = useNavigate();
  // useEffect(() => {
  //   navigate("/login");
  // }, []);
  const [darkMode, setDarkMode] = useState(false);
  const [editState, setEditState] = useState(true);

  const buildGuide = async () => {
    const response = await sendBuildRequest();
    console.log("Response", response);
  };
  function GetToggleIcon() {
    if (editState) {
      return <MdEdit size={25} />;
    }
    return <MdEditOff size={25} />;
  }
  return (
    <>
      <AppContext.Provider
        value={{
          editMode: editState,
          // setEditMode: setEditState,
        }}
      >
        <div className={darkMode ? "dark" : ""}>
          <OndcTitle>
            <LoadingButton onClick={buildGuide} buttonText="BUILD" />

            <span style={{ marginRight: "10px" }}></span>
            {GlobalEditMode && (
              <>
                <button
                  onClick={async () => navigate("/guide")}
                  className="text-white bg-gray-800 hover:bg-gray-900 font-semibold p-2"
                >
                  GUIDE
                </button>
                <button
                  onClick={() => setEditState((s) => !s)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-semibold p-2 ml-2"
                >
                  <GetToggleIcon />
                </button>
              </>
            )}
            {/* <LoadingButton onClick={waitOneSecond} buttonText="RAISE PR" /> */}
          </OndcTitle>

          <Routes>
            <Route path="/login" element={<GitLogin />} />
            <Route path="/home" element={<HomePage editMode={editState} />} />
            <Route path="/guide" element={<GuidePage />} />
            <Route path="/*" element={<GitLogin />} />
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
      </AppContext.Provider>
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
