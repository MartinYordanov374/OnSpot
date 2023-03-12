import React, { Component } from 'react'
import { Modal, Button, FormControl, InputGroup } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import Axios from 'axios'
import io from 'socket.io-client';
import { Buffer } from 'buffer';

import './Styles/ChatboxModal.css'
export default class ChatBoxModalComponent extends Component {

  constructor()
  {
    super()
    this.state = {
      message: '', 
      conversationMessages: [], 
      receiverID: -1, 
      senderID: -1, 
      socket: null,
      currentUserData: null
  }
    
  }
  componentDidMount = async() =>
  {
      let currentUserData = await this.getCurrentUserData()

      this.setState({'currentUserData': currentUserData}, () => {
        let currentUserID = this.state.currentUserData.id
        let receiverID = window.location.href.split('/')[4]
        this.getConversationMessages(receiverID)
        setTimeout(() => {
          this.setState({'receiverID': Number(receiverID)})
          this.setState({'senderID': Number(currentUserID)})
        }, 200)
      });

      this.socket = io('http://localhost:3030');
      this.socket.on("newMessage", async (data) => {
            const { senderID, receiverID, message } = data;

            this.setState({ 'conversationMessages': data.data }, () => {
            });

            this.setState({'message': null})
      })

      let chatboxWrapper = document.querySelector(".chatWrapper");
      chatboxWrapper.scrollTop = chatboxWrapper.scrollHeight;
  }
  componentWillUnmount() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
  
  getConversationMessages = async(receiverID) => {
    try{
      let result = await Axios.get(`http://localhost:3030/getConversationMessages/${receiverID}`, 
      {withCredentials: true})      
      let conversationMessages = result.data.data.data
      this.setState({'conversationMessages': conversationMessages})

    }
    catch(err)
    {
      console.log(err)
    }

  }

  getCurrentUserData = async() => {
    let currentUserData = await Axios.get('http://localhost:3030/getUserData', {withCredentials: true})
    let currentUserObject = currentUserData.data[0]
    return currentUserObject
  }

  sendMessage = async () => {
    try {

      const receiverID = this.state.receiverID
      const currentUserID = this.state.currentUserData.id;
      const socket = io("http://localhost:3030");
  
      socket.emit("sendMessage", {
        senderID: currentUserID,
        receiverID: receiverID,
        message: this.state.message
      });

    socket.emit('requestConvo', {'receiverID': Number(receiverID), 'senderID':Number(currentUserID)})
      socket.emit("notify", {
        notificationData: { senderID: currentUserID, receiverID: receiverID },
        isMessage: true,
        isPost: false,
        isFollower: false,
        isComment: false
      });

      const messageInputField = document.querySelector(".sendMessageInputField");
      messageInputField.value = "";
    } 
    catch (err) {
      console.log(err);
    }
  };
  render() {
    
    return (
      <div  className={this.props.props.isModalShown == true ? " modal modal-visible" : " modal modal-hidden"}>
        
        <Modal.Dialog>
            <Modal.Header closeButton onClick={() => this.props.props.modalHandler()}>
            {this.props.props.receiverData.ProfilePicture.data ?
            <img 
                      src={
                       `data: image/png;base64,
                       ${Buffer.from(this.props.props.receiverData.ProfilePicture.data).toString('base64')}`}
                    className='userPFP'
            />
            :
            <img 
              className='userPFP'
              src='https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.pinimg.com%2F736x%2F8b%2F16%2F7a%2F8b167af653c2399dd93b952a48740620.jpg&f=1&nofb=1&ipt=33608bf0973b950d8a9032fd47b796c156c60bf3f6edf4b174dc2947f2d9b4da&ipo=images'
            />
                      }
            <Modal.Title>{this.props.props.receiverData.Username}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
            <div className='chatWrapper'>
              {this.state.conversationMessages.length >= 1 
                ? 
                this.state.conversationMessages.sort((messageOne, messageTwo) => 
                      messageOne.DateSent.localeCompare(messageTwo.DateSent))
                .map((message) => {
                    return(
                    message.SenderUserID != this.state.receiverID 
                      ? 
                        <div className='senderMessage message'>{message.Message}</div> 
                      :
                        <div className='receiverMessage message'>{message.Message}</div>
                  )})
                :
                ""
            }
            </div>
            </Modal.Body>

            <Modal.Footer>
                <InputGroup>
                    <FormControl className='sendMessageInputField' onChange={(e) => this.setState({'message': e.target.value})}/>
                    <Button variant="primary" className='sendMessageBtn' onClick={() => this.sendMessage()}>
                        <FontAwesomeIcon icon={faPaperPlane}/>
                    </Button>
                </InputGroup>
            </Modal.Footer>
        </Modal.Dialog>
      </div>
    )
  }
}