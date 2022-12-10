import Axios from 'axios';
import React, { Component } from 'react'
import { Container,Card,Button } from 'react-bootstrap'
import '../EventCardComponent/EventCardStyles/EventCard.css'

export default class EventCardComponent extends Component {

  render() {
    let eventData = this.props;
    return (
        <Container className='eventCardWrapper'>
            <Card className='eventCard'>
                <Card.Header className = 'eventCardHeader'>
                    <div className = 'eventCardHeaderDetails row'>
                        <Card.Img 
                            style={{borderRadius: "50%", width: "100px", height: "50px"}}
                            src='https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.pinimg.com%2F736x%2F8b%2F16%2F7a%2F8b167af653c2399dd93b952a48740620.jpg&f=1&nofb=1&ipt=33608bf0973b950d8a9032fd47b796c156c60bf3f6edf4b174dc2947f2d9b4da&ipo=images'>
                        </Card.Img>
                        <p className='eventCardHeaderDetail eventHost col'>{eventData.props.Username}</p>
                        <p className='eventCardHeaderDetail eventType col'>{eventData.props.EventType == 0 ? "Public" : "Private"}</p>
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
