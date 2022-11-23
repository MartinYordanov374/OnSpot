import React, { Component } from 'react'
import { Container,Card,Button, FormControl, Form } from 'react-bootstrap'
import NavbarComponentRegisteredUser from '../NavbarComponent/NavbarComponentRegisteredUser'
import './HostAnEventPageStyles/HostAnEventComponentStyles.css'
export default class HostAnEventPageComponent extends Component {
  render() {
    return (
        <Container>
            <NavbarComponentRegisteredUser/>
            <Card className='HostEventCard'>
                <Card.Body>
                    <div className='row'>
                        <div className='eventNameWrapper col-sm mt-5'>
                            <h2 className='fieldLabel'>Event name</h2>
                            <FormControl className='inputField' placeholder='Enter your event Name'/>
                        </div>
                        <div className='eventTypeWrapper col-sm mt-5'>
                            <h2 className='fieldLabel'>Event type</h2>
                            <FormControl className='inputField' placeholder='Enter your event type, e.g.'/>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='eventDescriptionWrapper col-sm mt-5'>
                            <h2 className='fieldLabel'>Event description</h2>
                            <FormControl className='inputField' placeholder='Event description'/>
                        </div>
                        <div className='eventCategoryWrapper col-sm mt-5'>
                            <h2 className='fieldLabel'>Event category</h2>
                            <FormControl className='inputField' placeholder='Event category'/>
                        </div>
                    </div>
                    <div className='buttonWrapper d-flex justify-content-center mt-3'>
                        <Button className='hostEventButton'>Host event</Button>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    )
  }
}
