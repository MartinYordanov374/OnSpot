import Axios from 'axios';
import React, { Component } from 'react'
import { Container,Card,Button } from 'react-bootstrap'
import { Buffer } from 'buffer';

import '../EventCardComponent/EventCardStyles/EventCard.css'

export default class EventCardComponent extends Component {


  render() {

    let eventData = this.props;
    return (
        <Container className='eventCardWrapper'>
            <Card className='eventCard'>
                <Card.Header className = 'eventCardHeader'>
                    <div className = 'eventCardHeaderDetails row'>
                    {eventData.props.ProfilePicture.data 
                      ?
                      <Card.Img 
                            src={
                              `data: image/png;base64,
                              ${Buffer.from(eventData.props.ProfilePicture.data).toString('base64')}`
                              }
                            className='eventHostPFP'
                        />
                      :
                      <Card.Img 
                          src={`${eventData.props.ProfilePicture.data}`}
                          className='eventHostPFP'
                        />
                    }
                        <p className='eventCardHeaderDetail eventHost col'>{eventData.props.Username}</p>
                        <p className='eventCardHeaderDetail eventType col'>{eventData.props.EventType == 1 ? "Public" : "Private"}</p>
                        <p className='eventCardHeaderDetail eventClass col'>{eventData.props.EventClass}</p>
                    </div>
                </Card.Header>
                <Card.Body className = 'eventCardBody'>
                    <Card.Title className='eventCardTitle'>{eventData.props.EventName}</Card.Title>
                    <Card.Subtitle className='eventCardDescription'>{eventData.props.EventDescription}</Card.Subtitle>
                </Card.Body>
                <Card.Footer className = 'eventCardFooter'>
                        <Button className='learnMore btn-light' href={`Event/${eventData.props.EventID}`}>Learn more</Button>
                        
                </Card.Footer>
            </Card>
        </Container>
    )
  }
}
