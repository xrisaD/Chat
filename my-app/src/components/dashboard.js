import React, { useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import { useNavigate } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from "axios";

const Dashboard  = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState(null);

  async function logout() {
    localStorage.clear();
    navigate("/");
  }

  useEffect(() => {
    axios.get("http://localhost:8080/all_rooms")
    .then(res => {
        setRooms(res.data);
    })
  }, []);

  const getRooms = () => {
    if (rooms!=null){
      return <div>
      {rooms.map((room) => 
      <Link key={room.id} to={`/room/${room.id}`}>
        <p>{room.name}</p>
      </Link>)}
      </div>
    }
  }


  return (
    <div>
      <h1>WELCOME USER!</h1>
      { getRooms()}
      <Button onClick={logout} >Logout</Button>
    </div>
  );
  
}
export default Dashboard;