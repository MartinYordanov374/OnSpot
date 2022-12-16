import React, { Component } from 'react'
import { Modal, Button, FormControl, InputGroup } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import Axios from 'axios'

import './Styles/ChatboxModal.css'
export default class ChatBoxModalComponent extends Component {

  constructor()
  {
    super()
    this.state = {message: '', conversationMessages: []}
  }
  componentDidMount()
  {
      let chatboxWrapper = document.querySelector(".chatWrapper");
      chatboxWrapper.scrollTop = chatboxWrapper.scrollHeight;
      this.getConversationMessages()
  }

  getConversationMessages = async() => {
    try{
      let receiverID = window.location.href.split('/')[4]
      let result = await Axios.get(`http://localhost:3030/getConversationMessages/${receiverID}`, 
      {withCredentials: true})

      //TODO: RENAME DATA TO SOMETHING MORE MEANINGFUL
      let conversationMessages = result.data.data.data
      this.setState({'conversationMessages': conversationMessages})

    }
    catch(err)
    {
      console.log(err)
    }
  }
  sendMessage = async() => 
  {
    try{
      let receiverID = window.location.href.split('/')[4]
      let message = this.state.message
      let result = await Axios.post(`http://localhost:3030/sendMessage/${receiverID}`, 
      {message: message}, 
      {withCredentials: true})
    }
    catch(err)
    {
      console.log(err)
    }

  }
  render() {
    return (
      <div  className={this.props.props.isModalShown == true ? " modal modal-visible" : " modal modal-hidden"}>
        
        <Modal.Dialog>
            <Modal.Header closeButton onClick={() => this.props.props.modalHandler()}>
            <img 
                    // src={
                    //   `data: image/png;base64,
                    //   ${Buffer.from(this.state.userData.ProfilePicture.data).toString('base64')}`
                    //   }
                    src='https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.pinimg.com%2F736x%2F8b%2F16%2F7a%2F8b167af653c2399dd93b952a48740620.jpg&f=1&nofb=1&ipt=33608bf0973b950d8a9032fd47b796c156c60bf3f6edf4b174dc2947f2d9b4da&ipo=images'
                    className='userPFP'
            />
            <Modal.Title>Username</Modal.Title>
            </Modal.Header>

            <Modal.Body>
            <div className='chatWrapper'>
                <div className='receiverMessage message'>Hello?</div>
                <div className='senderMessage message'>Hello, is this Seeker?</div>
                <div className='receiverMessage message'>Yes, it is me!</div>
                <div className='senderMessage message'>GOSH! THE EVENT LAST WEEK WAS ABSOLUTELY AMAZING!!!</div>
                <div className='receiverMessage message'>I know right! I'm about to host another one soon! Stay tuned !</div>
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
