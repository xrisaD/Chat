
import "./App.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import Signup from "./components/Signup";
import axios from "axios";
import { myInterceptor } from "./Interceptors";
import React, { useState, useEffect } from "react"; 
import Dashboard from "./components/Dashboard";
import Spinner from 'react-bootstrap/Spinner';

function App() {
  return (
    <div className="App">
      <header className="App-header">
      <BrowserRouter>
        <Routes>
          <Route exact path={process.env.REACT_APP_PREFIX + "/login"} element={<IsAuth redirectTo="/dashboard"> <Login/> </IsAuth>} />
          <Route exact path={process.env.REACT_APP_PREFIX + "/signup"} element={<IsAuth redirectTo="/dashboard"> <Signup/> </IsAuth>} />
          <Route exact path={process.env.REACT_APP_PREFIX + "/dashboard"} element={ <RequireAuth redirectTo="/login"> <Dashboard/> </RequireAuth>}/>
          <Route exact path={process.env.REACT_APP_PREFIX + "/"} element={<Home/>} />
          <Route path="*" element={<Navigate to={process.env.REACT_APP_PREFIX + "/"} />} />
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
  
  useEffect(() => {
    async function isAuth() {
      try {
        // set loading to true before calling 
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
    }
    isAuth();
  }, []);

  // TODO: return a Spinner when loading is true
  if(loading) return (
    <Spinner animation="border" />
  );

  if (!isAuthenticated) return (
    <Navigate to={redirectTo} />
  );
  
  return children;
}

async function get() {
  var isAuthenticated = null;
  myInterceptor();
  await axios.get(process.env.REACT_APP_SERVER_AUTH + "/authorize")
  .then(res => {
    isAuthenticated = true;
  }).catch (error => { isAuthenticated = false;});
  return isAuthenticated;
}

export default App;

