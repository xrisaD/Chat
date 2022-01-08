import React from "react";
import './Chat.css';
import axios from "axios";
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import Chat from "./Chat";
import { useNavigate } from "react-router-dom";
import { myInterceptor } from "../Interceptors";
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
        SockJS = new SockJS(process.env.REACT_APP_SERVER + '/ws/?access_token=' + jwtToken);
        stompClient = Stomp.over(SockJS);
        stompClient.connect({}, this.onConnected, this.onError);
    }

    onConnected = () => {
        // Subscribing to all rooms and get the history
        this.state.rooms.forEach( (room) => { 
            var id = room.id;
            axios.get(process.env.REACT_APP_SERVER + "/history/" + id, ).then(res => {
              this.setState(prevState => ({
                           messages: {   
                              ...prevState.messages,        
                              [id]: res.data
                            }
                          }))
              stompClient.subscribe('/topic/' + id, this.onMessageReceived);
            })

        });

    }


    componentDidMount() {
        axios.get(process.env.REACT_APP_SERVER +"/all_rooms")
        .then(res => {
            this.setState({rooms: res.data});
            this.connect();
        })

        axios.get(process.env.REACT_APP_SERVER +"/info")
        .then(res => {
            this.setState({username: res.data});
        })
    }
    componentWillUnmount() {
      this.state.rooms.forEach( (room) => {
          var id = room.id;
          stompClient.unsubscribe('/topic/' + id);
      });
    }
   onMessageReceived = (payload) => {
     
        // save message
        var body = JSON.parse(payload.body);
        if (body.username !== this.state.username && body.roomId !== this.state.selectedRoom) {
            let newNotifications = this.state.notifications;
            newNotifications.push(body.roomId);
            this.setState({notifications: newNotifications});

        }
        
        const id = body.roomId;
        if (body.file != null) {  
          // this messages has a file
          myInterceptor();
          axios.get(process.env.REACT_APP_SERVER +"/download/"+body.file.id)
          .then(res => {
              let newMessages = this.state.messages[id];
              newMessages.push({"username": body.username, "content": body.content, "time": body.time, "file": {"name":body.file.name, "content":res.data, "contentType":body.file.contentType}});
              this.setState(prevState => ({
                messages: {   
                  ...prevState.messages,        
                  [id]: newMessages
                }
              }))
            })
        } else {
          // this message doesn't have a file
          let newMessages = this.state.messages[id];
          newMessages.push({"username": body.username, "content": body.content, "time": body.time, "file":null});
          this.setState(prevState => ({
            messages: {   
              ...prevState.messages,        
              [id]: newMessages
            }
          }))
        }
    }
 
    onError = (error) => {
        this.setState({
          error: 'Could not connect you to the Chat Room Server. Please refresh this page and try again!'
        })
      }

   
    selectRoom = (room) => {
      this.setState({selectedRoom: room.id})
      this.setState({selectedRoomName: room.name});
      
      // delete the notification symbol because the user just opened the chat
      var newNotifications = this.state.notifications;
      const index = newNotifications.indexOf(room.id);
      if (index > -1) {
        newNotifications.splice(index, 1);
        this.setState({notifications: newNotifications});
      }
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
        localStorage.clear();
        this.props.navigate(process.env.REACT_APP_PREFIX + '/');
    }

    sendMessage = (content, roomId, file) => {
        //Create an object of formData
        const formData = new FormData();
        // Update the formData object
        formData.append("file", file);

        var chatMessage = {
          content: content,
          roomId: roomId
        };

        formData.append("file", file);
        formData.append("message", new Blob([JSON.stringify(chatMessage)], { type: "application/json"}));

        myInterceptor();
        axios.post(process.env.REACT_APP_SERVER+"/chat", formData);
      
    }
    render () {
        return (
        <div className="chat-page">
            <div><Button onClick={() => {this.logout() }} >Logout</Button></div>
            <div className="chat-box-container">
            <Container>
                <Row className="mb-3 row-container">
                    <Col className="list-scroll list-with-rooms"> <h4>Chat Rooms</h4> { this.getRooms() }</Col> 
                    <Col className="list-scroll">{ this.showSelectedRoom() }</Col>
                </Row>
                </Container>
            </div>
        </div>
      )};
  }

function WithNavigate(props) {
    let navigate = useNavigate();
    return <Dashboard {...props} navigate={navigate} />
}
export default WithNavigate;