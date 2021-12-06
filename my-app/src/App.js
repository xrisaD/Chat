
import "./App.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/login";
import Home from "./components/home";
import Signup from "./components/signup";
import axios from "axios";
import { myInterceptor } from "./Interceptors";
import React, { useState, useEffect } from "react"; 
import Dashboard from "./components/dashboard";
import Chat from "./components/Chat";
import Room from "./components/Room";

function App() {
  window.React1 = require('react');

  return (
    <div className="App">
      <header className="App-header">
      <BrowserRouter>
        <Routes>
          <Route exact path="/login" element={<IsAuth redirectTo="/dashboard"> <Login/> </IsAuth>} />
          <Route exact path="/signup" element={<IsAuth redirectTo="/dashboard"> <Signup/> </IsAuth>} />

          <Route exact path="/dashboard" element={ <RequireAuth redirectTo="/login"> <Dashboard/> </RequireAuth>}/>

          <Route exact path="/room/:id" element={ <RequireAuth redirectTo="/login"> <Chat/> </RequireAuth>}/>

          <Route exact path="/" element={<Home/>} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
      </header>
    </div>
  );
}

function IsAuth({ children, redirectTo }) {
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  if (isAuthenticated === true) {
    return <Navigate to={redirectTo} />
  } else {
    return children;
  }
}
function RequireAuth({ children, redirectTo }) {

  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(async () => {
     try {
       // set loading to true before calling API
       setLoading(true);
       const res = await get();
       localStorage.setItem("isAuthenticated", res);
       setIsAuthenticated(res);
       // switch loading to false after fetch is complete
       setLoading(false);
     } catch (error) {
       //TODO: add error handling here
       setLoading(false);
       console.log(error);
     }
  }, []);

  // TODO: return a Spinner when loading is true
  if(loading) return (
    <span>Loading</span>
  );

  if (!isAuthenticated) return (
    <Navigate to={redirectTo} />
  );
  
  return children;
}

async function get() {
  const endpoint = "http://localhost:8080/api/v1/authorize";
  var isAuthenticated = null;

  myInterceptor();

  await axios.get(endpoint)
  .then(res => {
    isAuthenticated = true;
  }).catch (error => { isAuthenticated = false;});
  return isAuthenticated;
}

export default App;

