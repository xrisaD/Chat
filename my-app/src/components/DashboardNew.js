import React, {Component} from "react";
import './Chat.css';
import axios from "axios";
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import Chat from "./ChatNew";
import { useNavigate } from "react-router-dom";

var stompClient = null;
class Dashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state =
          {
            username: "",
            rooms: [],
            content: "",
            messages: {},
            error: "",
            notifications: [], 
            selectedRoom: null,
            selectedRoomName: null
          };
      }
    
    connect = () => {
        const jwtToken = localStorage.getItem("authorization");
        const Stomp = require('stompjs');
        var SockJS = require('sockjs-client');
        SockJS = new SockJS('http://localhost:8080/ws/?access_token=' + jwtToken);
        stompClient = Stomp.over(SockJS);
        stompClient.connect({}, this.onConnected, this.onError);
    }

    onConnected = () => {
        // Subscribing to all rooms
        this.state.rooms.forEach( (room) => { 
            var id = room.id;
            this.state.messages[id] = [];
            stompClient.subscribe('/topic/' + id, this.onMessageReceived);});
        this.setState(this.state)
    }


    componentDidMount() {
        axios.get("http://localhost:8080/all_rooms")
        .then(res => {
            this.state.rooms = res.data;
            this.setState(this.state);
            this.connect();
        })

        axios.get("http://localhost:8080/info")
        .then(res => {
            this.state.username = res.data;
            this.setState(this.state);
        })
    }

   onMessageReceived = (payload) => {
        var body = JSON.parse(payload.body);
        // save message
        this.state.messages[body.roomId].push({"sender": body.username, "content": body.content, "time": body.time});
        if (body.username != this.state.username && body.roomId != this.state.selectedRoom) {
            this.state.notifications.push(body.roomId);
        }
        this.setState(this.state);
    }
 
    onError = (error) => {
        this.setState({
          error: 'Could not connect you to the Chat Room Server. Please refresh this page and try again!'
        })
      }

    sendMessage = (content, roomId) => {
        if (stompClient) {
          var chatMessage = {
            content: content,
            roomId: roomId
          };
          // send public message
          stompClient.send("/app/chat/" + roomId, {}, JSON.stringify(chatMessage));
        }
      }
    
    selectRoom = (room) => {
        this.state.selectedRoom = room.id;
        this.state.selectedRoomName = room.name; 
        const index = this.state.notifications.indexOf(room.id);
        if (index > -1) {
            this.state.notifications.splice(index, 1);
        } 
        this.setState(this.state);
    }

    getRooms = () => {
        if (this.state.rooms != null){
          return <ul>
          {this.state.rooms.map((room) => 
            <li key={room.id} onClick={() => {this.selectRoom(room)}}>
              <p className="room-name">{room.name} {this.state.notifications.includes(room.id) && <AnnouncementIcon/>} </p>
            </li>)}
          </ul>
        }
      }
     showSelectedRoom = () => {
        if (this.state.selectedRoom === null) {
            return <p>Select a chat room.</p>
        } else {
          // the user has selected a room
          // show chat and messages
          return (<Chat key={this.state.selectedRoom} id={this.state.selectedRoom} username={this.state.username} selectedRoomName={this.state.selectedRoomName} messages={this.state.messages[this.state.selectedRoom]} parentCallback={this.sendMessage}/>)
        }
    }

    logout = () => {
        console.log("naviashsh")
        localStorage.clear();
        this.props.navigate('/');
    }
    render () {
        return (
        <div className="chat-box-container">
          <Button onClick={() => {this.logout() }} >Logout</Button>
          <div>
            <Row className="mb-3 row-container">
                <Col className="list-with-chats"> <h3>Chat Rooms</h3> { this.getRooms() }</Col> 
                <Col>{ this.showSelectedRoom() }</Col>
            </Row>
          </div>
        </div>
      )};
}

function WithNavigate(props) {
    let navigate = useNavigate();
    return <Dashboard {...props} navigate={navigate} />
}
export default WithNavigate;