import React from "react";
import './Chat.css';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import profile from "./../profile.png";

class Chat extends React.Component {

  constructor(props) {
    super(props);
    this.state =
      {
        username: props.username,
        roomId: props.id,
        content: "",
        file: null,
        selectedRoomName: props.selectedRoomName,
        messages: props.messages
        
      };
  }

  handleMessageChange = (e) => {
    this.setState({content: e.target.value});
    }

  handleFileChange = (e) => {
    this.setState({file: e.target.files[0]});
  }

  sendMessage = (event) => {
    event.preventDefault();
    this.props.parentCallback(this.state.content, this.state.roomId, this.state.file);
  }

  downloadTxtFile = (file) => {
    const element = document.createElement("a");
    const fileBlob = new Blob([file.content], {
      type: file.contentType
    });
    element.href = URL.createObjectURL(fileBlob);
    element.download = file.name;
    document.body.appendChild(element);
    element.click();
  };

  addFile(file) {
    if (file !== null) {
      return <AttachFileIcon onClick={ () => this.downloadTxtFile(file)}>Download</AttachFileIcon>
      
    }
  }
  render() {
      return (
      <div className="chat-container">
        <h4>{this.state.selectedRoomName}</h4>
        <div className="messages-container">
        {this.state.messages.map((value, i) => {
          if (value.image == null) {
              value.image = profile;
          }
          if (value.username !== this.state.username){
            return (<div className="message-container" key={i}>
                    <Container className="message-container-inner">
                      <Row className="justify-content-md-center">
                        <Col md="auto" className="profile-image"><img src={value.image} alt="profile" height={30} width={30}></img><p>{value.username}</p></Col>
                        <Col>
                          <div className="message-content">
                            <p>{value.content}</p>
                            {this.addFile(value.file)}
                            <span className="time-right">{value.time}</span>
                          </div>
                        </Col>
                      </Row>
                      
                    </Container>
                  </div>
            )
          } else {
            return (
              <div className="message-container" key={i}>
              <Container className="message-container-inner">
                <Row className="justify-content-md-center">
                  <Col>
                    <div className="message-content darker">
                      <p>{value.content}</p>
                      {this.addFile(value.file)}
                      <span className="time-left">{value.time}</span>
                    </div>
                  </Col>
                  <Col md="auto" className="profile-image"><img src={value.image} alt="profile" height={30} width={30}></img><p>Me</p></Col>
                </Row>
              </Container>
            </div>)
          }
          })}
       </div>

        <form className="form-message">
          <input type="file" id="file" name="file" onChange={this.handleFileChange}/>
          <input className="message-input" type="text" name="name" placeholder="Type your message" value={this.state.content} onChange={this.handleMessageChange} />
          <input type="submit" value="Send" onClick={this.sendMessage}/>
        </form>
     </div>)
  }
}

export default Chat;
