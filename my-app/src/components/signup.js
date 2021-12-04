import React from "react";
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";


const Signup = () => {
  const navigate = useNavigate();
  
  const [validated, setValidated] = useState(false);
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [password, setPassword] = useState('');
    
  const handleSubmit = (event) => {
  
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      console.log("false")
      event.preventDefault();
      event.stopPropagation();
    } else {
      const endpoint = "http://localhost:8080/api/v1/auth/signup";
      const user_object = {
          username: username,
          password: password,
          firstname: firstname,
          lastname: lastname,
          email: email,
          city: city,
          zipCode: zipCode,
          password: password
        };
      axios.post(endpoint, user_object).then(res => {console.log("true");
        localStorage.setItem("isAuthenticated", true);
        localStorage.setItem("authorization", res.data.token);
        navigate("/dashboard");
      }).catch(error => {
        console.log(error)
      });
  }
  setValidated(true);
  };

  return (
    <Container>
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
        
      <Row className="mb-3">
        <Form.Group as={Col} md="4" controlId="validationCustom01">
          <Form.Label>First name :</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="First name"
            value={firstname} onChange={e => setFirstname(e.target.value)}
          />
          <Form.Control.Feedback type="invalid">Please enter your first name</Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="4" controlId="validationCustom02">
          <Form.Label>Last name :</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Last name"
            value={lastname} onChange={e => setLastname(e.target.value)}
          />
          <Form.Control.Feedback type="invalid">Please enter your last name</Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="4" controlId="validationCustomUsername">
          <Form.Label>User name :</Form.Label>
          <InputGroup hasValidation>
            <Form.Control
              type="text"
              placeholder="Username"
              aria-describedby="inputGroupPrepend" 
              required
              value={username} onChange={e => setUsername(e.target.value)}
            />
            <Form.Control.Feedback type="invalid">
              Please choose a username.
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
      </Row>


      <Row className="mb-3">
        <Form.Group as={Col} md="4" controlId="formBasicEmail">
          <Form.Label>Email :</Form.Label>
          <Form.Control required type="email" placeholder="Enter email" value={email} onChange={e => setEmail(e.target.value)}/>
          <Form.Control.Feedback type="invalid">Please enter a valid email.</Form.Control.Feedback>
        </Form.Group>

        <Form.Group as={Col} md="5" controlId="validationCustom03">
          <Form.Label>City :</Form.Label>
          <Form.Control type="text" placeholder="City" required value={city} onChange={e => setCity(e.target.value)} />
          <Form.Control.Feedback type="invalid">
            Please provide a valid city.
          </Form.Control.Feedback>
        </Form.Group>
        
        <Form.Group as={Col} md="3" controlId="validationCustom05">
          <Form.Label>Zip Code :</Form.Label>
          <Form.Control type="text" placeholder="Zip" required value={zipCode} onChange={e => setZipCode(e.target.value)}/>
          <Form.Control.Feedback type="invalid">
            Please provide a valid zip.
          </Form.Control.Feedback>
        </Form.Group>
      </Row>

      <Row className="mb-1">
        <Form.Group as={Col} md="5" controlId="formBasicPassword">
          <Form.Label>Password :</Form.Label>
          <Form.Control type="password" placeholder="Password" required value={password} onChange={e => setPassword(e.target.value)}/>
          <Form.Control.Feedback type="invalid">
            Please enter your password.
          </Form.Control.Feedback>
        </Form.Group>
      </Row>

      <Form.Group className="mb-3">
        <Form.Check
          required
          label="Agree to terms and conditions"
          feedback="You must agree before submitting."
          feedbackType="invalid"
        />
      </Form.Group>
      <Button type="submit">Submit form</Button>
    </Form>
    </Container>
  );
}


export default Signup;