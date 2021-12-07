import { useParams } from 'react-router-dom';
import './Chat.css';
import React, { useState, useEffect } from "react";

const Room  = ({ username, id, messages }) => {
    console.log(messages)
    const [content, setContent] = useState(null);
    const hasMessages = !(messages === undefined); 
  useEffect(() => {
    // TODO: load history of messages for this room
    
  }, []);
  
  const sendMessage = (event) => {

  }

  const handleMessageChange = (e) => {
      console.log(e.target.value)
    setContent(e.target.value);
  }
    return (
        <div className="chat-container">
          <div className="messages-container">
              { hasMessages ? ( 
                  messages.map((value, i) =>{
                if (value.sender === username){
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
                }})
              ): (
                <p> No messages yet</p>
              )}
              
          </div>
          <form className="form-message">
            <input className="message-input" type="text" name="name" placeholder="Type your message" onChange={handleMessageChange} />
            <input type="submit" value="Submit" onClick={sendMessage}/>
          </form>
       </div>)
}

export default Room;