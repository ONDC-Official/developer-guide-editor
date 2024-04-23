import "./App.css";
import React, { useEffect } from "react";
import { OndcTitle } from "./components/title";
import TestButton from "./components/ui/tooltip-text";
import { getData } from "./utils/requestUtils";
import GitLogin from "./pages/login-page";
import { HomePage } from "./pages/home-page";
import { DataContext } from "./context/dataContext";
// import files from "./files.json";

function App() {
  const [loggedIn, setLoggedIn] = React.useState(false);
  return (
    <>
      <OndcTitle />
      {loggedIn ? (
        <HomePage />
      ) : (
        <GitLogin loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
      )}
    </>
  );
}

export default App;
