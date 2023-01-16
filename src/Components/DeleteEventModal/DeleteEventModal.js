import React, { Component } from 'react'
import { Modal, Button } from 'react-bootstrap'
import './Styles/DeleteEventModal.css'
import Axios from 'axios'

export default class DeleteEventModal extends Component {

    deleteEvent = async() => {
        console.log('deleting!')
        let userID = Number(this.props.props.userID)
        let eventID = Number(this.props.props.eventID)

        await Axios.delete(`http://localhost:3030/deleteEvent/${userID}/${eventID}`)
        .then((res) => {
            setTimeout(() => {
                window.location.href='/'
            }, 600);
        })
        .catch((err) => {
            console.log(err)
        })
    }
    render() {
    return (
        <div  className={this.props.props.isModalShown == true ? " modal modal-visible" : " modal modal-hidden"}>
            <Modal.Dialog >
                <Modal.Header>
                    <h2>Delete event confirmation</h2>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to delete this event forever?</p>
                    <p>This action is irreversible!</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button className='cancelButton' onClick={() => this.props.props.modalHandler()}> Cancel </Button>
                    <Button className='deleteButton btn-danger' onClick={() => this.deleteEvent()}> Delete </Button>
                </Modal.Footer>
            </Modal.Dialog>

        </div>
    )
  }
}
