import React, { Component } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorExists, setErrorExists] = useState(false);

  async function handleFormSubmit(event) {
    event.preventDefault();

    const endpoint = "http://localhost:8080/api/v1/auth/login";

    const user_object = {
      username: username,
      password: password
    };
    axios.post(endpoint, user_object).then(res => {
        localStorage.setItem("isAuthenticated", true);
        localStorage.setItem("authorization", res.data.token);
        navigate("/dashboard");
    }).catch(error => {
      if (error.response.status === 401) {
        setErrorExists(true);
      }
    });
  }

  return (
    <Form onSubmit={handleFormSubmit}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Username:</Form.Label>
        <Form.Control size="lg" type="username" placeholder="Enter usename"  value={username} onChange={e => setUsername(e.target.value)}/>
      </Form.Group>
    
      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password:</Form.Label>
        <Form.Control size="lg" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}/>
        {errorExists && <Form.Text className="text-muted">  Wrong username or password </Form.Text>}
      </Form.Group>

      <Button variant="primary" type="submit" >
        Submit
      </Button>
    </Form>
  );
}


export default Login;