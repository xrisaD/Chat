import React, {Component} from "react";
import './Chat.css';

var stompClient = null;
class Chat extends React.Component {

  constructor(props) {
      
    super(props);
    console.log(props.messages)
    this.state =
      {
        username: props.username,
        roomId: props.id,
        content: "",
        selectedRoomName: props.selectedRoomName,
        messages: props.messages
      };
  }

  handleMessageChange = (e) => {
    this.setState({content: e.target.value});
    }
  sendMessage = (event) => {
    event.preventDefault();
    this.props.parentCallback(this.state.content, this.state.roomId);
  }
  render() {
      return (
      <div className="chat-container">
          <h3>{this.state.selectedRoomName}</h3>
        <div className="messages-container">
            {this.state.messages.map((value, i) =>{
              if (value.sender !== this.state.username){
                return (<div className="message-container" key={i}>
                    <p> {value.sender}</p>
                    <p>{value.content}</p>
                    <span className="time-right">{value.time}</span>
                </div>)
              } else {
                return (<div className="message-container darker" key={i}>
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
