import React, { Component } from "react";
import Button from 'react-bootstrap/Button';
import { useNavigate  , Navigate} from "react-router-dom";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Home = () => {
  const navigate = useNavigate();

  async function goToLogIn() {
    navigate("/login");
  }

  async function goToSignUp() {
    navigate("/signup");
  }

  return (
    <div>
      <Row className="mb-3">
        <Col><Button onClick={goToSignUp} >Sign Up</Button></Col> 
        <Col><Button onClick={goToLogIn} >Log In</Button></Col>
      </Row>
    </div>
  );
  
}

export default Home;