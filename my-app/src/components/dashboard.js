import React, { useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import { useNavigate } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from "axios";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Chat from './Chat';
import AnnouncementIcon from '@mui/icons-material/Announcement';

var stompClient = null;
const Dashboard  = () => {
  const navigate = useNavigate();
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedRoomName, setSelectedRoomName] = useState(null);
  
  const [rooms, setRooms] = useState(null);
  const [username, setUsername] = useState(null);
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

    axios.get("http://localhost:8080/info")
    .then(res => {
        setUsername(res.data);
    })
  }, []);

  const getRooms = () => {
    if (rooms != null){
      return <ul>
      {rooms.map((room) => 
        <li key={room.id} onClick={() => handleClick(room.id, room.name)}>
          <p className="room-name">{room.name} {notification.includes(room.id) && <AnnouncementIcon/>} </p>
        </li>)}
      </ul>
    }
  }

  function handleClick (id, name) {
      setSelectedRoom(id)
      setSelectedRoomName(name)
  }

  const gotMessage = (roomId) =>{
    const newNotification = [...notification, roomId]
    setNotification(newNotification)
  }

  const showSelectedRoom = () => {
      if (selectedRoom === null) {
          return <p>Select a chat room.</p>
      } else {
        // the user has selected a room
        // show chat and messages
        return (<div> <h3>{selectedRoomName}</h3> <Chat key={selectedRoom} id={selectedRoom} username={username} parentCallback = {gotMessage}/> </div>)
      }
  }

  return (
    <div className="chat-box-container">
      <Button onClick={logout} >Logout</Button>
      <div>
        <Row className="mb-3 row-container">
            <Col className="list-with-chats"> <h3>Chat Rooms</h3> { getRooms() }</Col> 
            <Col>{ showSelectedRoom() }</Col>
        </Row>
      </div>
    </div>
  );
  
}
export default Dashboard;