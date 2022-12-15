import React, { Component } from 'react'
import { Modal, Button, FormControl } from 'react-bootstrap'
import './Styles/ChatboxModal.css'
export default class ChatBoxModalComponent extends Component {
    
  render() {
    console.log(this.props.props)
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
          <FormControl className='sendMessageInputField'>
            </FormControl>
          <Button variant="primary">Send</Button>
        </Modal.Footer>
      </Modal.Dialog>
      </div>
    )
  }
}
