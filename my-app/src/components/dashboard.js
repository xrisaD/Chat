import React, { useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import { useNavigate } from "react-router-dom";
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

  const Room = (props) => {
    return <li onClick={ () => navigateToRoom(props.id)}>{ props.name }</li>;
  }

  function navigateToRoom(id) {
    navigate("/room/"+id);
  }

  const getRooms = () => {
    if (rooms!=null){
      return <div>
      {rooms.map((room) => <Room key={room.id} name={room.name} id={room.id} />)}
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