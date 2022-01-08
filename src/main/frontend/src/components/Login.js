import React, { useState } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from "axios";
import { useNavigate } from "react-router-dom";


const Login = () => {
  const navigate = useNavigate();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorExists, setErrorExists] = useState(false);

  async function handleFormSubmit(event) {
    event.preventDefault();

    const user_object = {
      username: username,
      password: password
    };

    axios.post(process.env.REACT_APP_SERVER_AUTH + "/login", user_object).then(res => {
        localStorage.setItem("isAuthenticated", true);
        localStorage.setItem("authorization", res.data.token);
        navigate(process.env.REACT_APP_PREFIX + "/dashboard");
    }).catch(error => {
      localStorage.setItem("isAuthenticated", false);
      if (error.response && error.response.status === 401) {
        setErrorExists(true);
      } else {
        alert("Something went wrong. Try again later")
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
        Login
      </Button>
    </Form>
  );
}


export default Login;