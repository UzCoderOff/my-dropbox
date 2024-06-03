import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Home from "./components/home/Home";
import Signup from "./components/auth/Signup";
import Login from "./components/auth/Login";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/config";

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user ? user : null);
    });
    return () => unsubscribe();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
        <Route path="/signup" element={ user ? <Navigate to= "/"  /> : <Signup />} />
        <Route path="/login" element={ user ? <Navigate to= "/"  /> : <Login />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
