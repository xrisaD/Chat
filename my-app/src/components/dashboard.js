import React, { useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import { useNavigate } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from "axios";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Chat from './Chat';

var stompClient = null;
const Dashboard  = () => {
  const navigate = useNavigate();
  const [selectedRoom, setSelectedRoom] = useState(null);
  
  const [rooms, setRooms] = useState(null);
  const [notification, setNotification] = useState([]);
 

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
    if (rooms != null){
      return <div>
      {rooms.map((room) => 
        <li key={room.id} onClick={() => handleClick(room.id)}>
          <p>{room.name}</p> {notification.includes(room.id) && <p>NM!</p>}
        </li>)}
      </div>
    }
  }

  function handleClick (id) {
      setSelectedRoom(id)
  }

  const gotMessage = (roomId) =>{
    const newNotification = [...notification, roomId]
    setNotification(newNotification)
  }

  const showSelectedRoom = () => {
      if (selectedRoom === null) {
          return <p>Select a chat room.</p>
      } else {
        console.log(selectedRoom)
        // the user has selected a room
        // show chat and messages
        return <Chat key={selectedRoom} id={selectedRoom} parentCallback parentCallback = {gotMessage}/>
      }
  }

  return (
    <div>
      <Button onClick={logout} >Logout</Button>
      <div>
        <Row className="mb-3">
            <Col> { getRooms() }</Col> 
            <Col>{ showSelectedRoom() }</Col>
        </Row>
      </div>
    </div>
  );
  
}
export default Dashboard;