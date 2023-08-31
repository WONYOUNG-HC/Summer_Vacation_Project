import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import Modal from "react-modal";
import Login from "./login/Login.js";
import Main from "./login/Main.js";
import Layout from "./components/Layout";
import ImageSelection from "./components/ImageSelection";

function App() {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/layout/my_calendar");
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <Routes>
      <Route path="/" element={<Main handleLogin={handleLogin} />} />
      if(isLoggedIn== true) {<Route path="/layout/*" element={<Layout />} />}
    </Routes>
  );
}

Modal.setAppElement("#root");

export default App;
