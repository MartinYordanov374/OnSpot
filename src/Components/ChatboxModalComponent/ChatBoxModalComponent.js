import React, { Component } from 'react'
import { Modal, Button } from 'react-bootstrap'
import './Styles/ChatboxModal.css'
export default class ChatBoxModalComponent extends Component {
    
  render() {
    console.log(this.props.props)
    return (
      <div  className={this.props.props.isModalShown == true ? " modal modal-visible" : " modal modal-hidden"}>
        <Modal.Dialog>
        <Modal.Header closeButton onClick={() => this.props.props.modalHandler()}>
          <Modal.Title>Chatbox title</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>Chatbox body</p>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="primary">Send</Button>
        </Modal.Footer>
      </Modal.Dialog>
      </div>
    )
  }
}
