import React, {useEffect, useState} from "react";
import Button from 'react-bootstrap/Button';
import { useNavigate } from "react-router-dom";
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
  const [isAuth, setIsAuth] = useState(null)

  useEffect(() => {
    setIsAuth(localStorage.getItem("isAuthenticated"));
  }, [isAuth]);


  async function goToLogIn() {
    navigate(process.env.REACT_APP_PREFIX + "/login");
  }

  async function goToSignUp() {
    navigate(process.env.REACT_APP_PREFIX + "/signup");
  }

  async function goToDashboard() {
    navigate(process.env.REACT_APP_PREFIX + "/dashboard");
  }


  const returnButtons = (isAuth) => {
    if (isAuth === null || isAuth === "false" || isAuth === false){
      return ( <><Col><Button onClick={goToSignUp} >Sign Up</Button></Col> 
            <Col><Button onClick={goToLogIn} >Log In</Button></Col></>);
    } else if (isAuth ==="true" || isAuth === true){
      return(<Col><Button onClick={goToDashboard} >Dashboard</Button></Col>);
    }
  }
 
  return(<Row className="mb-3">
        {returnButtons(isAuth)}
  </Row>);
}

export default Home;