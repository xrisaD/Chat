import React, {Component} from "react";
import './Chat.css';
import SockJsClient from 'react-stomp';
import { useState } from 'react';

var stompClient = null;
class Chat extends React.Component {

  constructor(props) {
    console.log(props.id)
    super(props);
    this.state =
      {
        username: "chrysa",
        roomId: props.id,
        content: "",
        messages: []
      };
  }

  connect = () => {
      const Stomp = require('stompjs');
      var SockJS = require('sockjs-client');
      SockJS = new SockJS('http://localhost:8080/ws');
      stompClient = Stomp.over(SockJS);
      stompClient.connect({}, this.onConnected, this.onError);
  }

  onConnected = () => {
    // Subscribing to the public topic
    stompClient.subscribe('/topic/messages', this.onMessageReceived);
  }

  sendMessage = (event) => {
    event.preventDefault();
    if (stompClient) {
      var chatMessage = {
        id: this.state.username,
        content: this.state.content,
        roomId: 1
      };
      // send public message
      stompClient.send("/app/chat", {}, JSON.stringify(chatMessage));
    }
  }

  onMessageReceived = (payload) => {
      var body = JSON.parse(payload.body);
      // save message
      this.state.messages.push({"sender": body.useState, "content": body.content, "time": body.time})
      this.setState(this.state)
  }


  
  onError = (error) => {
    this.setState({
      error: 'Could not connect you to the Chat Room Server. Please refresh this page and try again!'
    })
  }

  fetchHostory = () => {
    alert('History Not Available!\nIt is Not Yet Implemented!');
  }

  componentDidMount() {
    this.connect();

  }

  handleMessageChange = (e) => {
    this.setState({content: e.target.value});
  }

  render() {
      return (
      <div className="chat-container">
        <div className="messages-container">
            {this.state.messages.map((value, i) =>{
              if (value.sender === this.state.username){
                return (<div class="message-container" key={i}>
                    <p> {value.sender}</p>
                    <p>{value.content}</p>
                    <span className="time-right">{value.time}</span>
                </div>)
              } else {
                return (<div class="message-container darker" key={i}>
                    <p> Me</p>
                    <p>{value.content}</p>
                    <span className="time-right">{value.time}</span>
                </div>)
              }
              })}
            
        </div>
        <form className="form-message">
          <input className="message-input" type="text" name="name" placeholder="Type your message" value={this.state.content} onChange={this.handleMessageChange} />
          <input type="submit" value="Submit" onClick={this.sendMessage}/>
        </form>
     </div>)
  }
}

export default Chat;
