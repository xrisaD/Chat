import React, { Component } from "react";
import Button from 'react-bootstrap/Button';
import { useNavigate  , Navigate} from "react-router-dom";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Home = () => {
  return (
    <div>
        <h1>Welcome</h1>
        {SignUpAndLoginButton()}  
    </div>
  );
  
}

const SignUpAndLoginButton = () => {
  const navigate = useNavigate();
  const isAuth = localStorage.getItem("isAuthenticated");

  async function goToLogIn() {
    navigate("/login");
  }

  async function goToSignUp() {
    navigate("/signup");
  }

  if (isAuth === null || isAuth === false){
    return ( <Row className="mb-3">
              <Col><Button onClick={goToSignUp} >Sign Up</Button></Col> 
              <Col><Button onClick={goToLogIn} >Log In</Button></Col>
              </Row>);
  }
}

export default Home;