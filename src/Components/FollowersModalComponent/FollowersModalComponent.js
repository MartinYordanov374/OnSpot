import React, { Component } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { Buffer } from 'buffer';
import './FollowersModalStyles/FollowersModalStyling.css'
export default class FollowersModalComponent extends Component {
    constructor()
    {
        super();
        this.state = {
            attendeesList: []
        }
    }
    componentDidMount()
    {
        this.setState({'attendeesList': this.props.props})
    }
  render() {
    return (
        <div>
            <Modal.Dialog >
                <Modal.Header>
                    <h2>Event Attendees</h2>
                </Modal.Header>
                <Modal.Body className='ModalWrapper'>
                    {this.state.attendeesList.map((attendant) => {
                        return(
                            <div className='AttendantWrapper'>
                                {attendant.ProfilePicture 
                                ?
                                <img 
                                    src={
                                      `data: image/png;base64,
                                      ${Buffer.from(attendant.ProfilePicture.data).toString('base64')}`
                                      }
                                    className='attendantPFP'
                                />
                              :
                                <img 
                                  src={`https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.pinimg.com%2F736x%2F8b%2F16%2F7a%2F8b167af653c2399dd93b952a48740620.jpg&f=1&nofb=1&ipt=33608bf0973b950d8a9032fd47b796c156c60bf3f6edf4b174dc2947f2d9b4da&ipo=images`}
                                  className='attendantPFP'
                                />
                                }
                                <h5 className='attendantUsername'>{attendant.Username}</h5>
                            </div>
                        )

                    })}
                </Modal.Body>
            </Modal.Dialog>
        </div>
    )
  }
}
