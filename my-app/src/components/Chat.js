import React from "react";
import SockJsClient from "react-stomp";
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
} from "@chatscope/chat-ui-kit-react";

class Chat extends React.Component {
    constructor(props) {
      super(props);
      // randomUserId is used to emulate a unique user id for this demo usage
      this.randomUserName = "user";
      this.randomUserId = "id";
      this.state = {
        clientConnected: false,
        messages: [{"message":"hey"}]
      };
    }
  
    onMessageReceive = (msg, topic) => {
        console.log("RECEIVE  "+msg);
      this.setState(prevState => ({
        messages: [...prevState.messages, msg]
      }));
    }
  
    sendMessage = (msg, selfMsg) => {
        console.log("SENDDD  "+msg)
        console.log(selfMsg)
      try {
        this.clientRef.sendMessage("/app/chat", JSON.stringify(selfMsg));
        return true;
      } catch(e) {
        return false;
      }
    }
  
    // componentWillMount() {
    //   Fetch("/history", {
    //     method: "GET"
    //   }).then((response) => {
    //     this.setState({ messages: response.body });
    //   });
    // }
  
    render() {
      const wsSourceUrl = "http://localhost:8080/chat";
      return (
        <div>
          
  
    
        </div>
      );
    }
  }

  export default Chat;