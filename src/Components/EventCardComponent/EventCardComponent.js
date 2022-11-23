import React, { Component } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTag } from "@fortawesome/free-solid-svg-icons";

import { Container,Card,Button } from 'react-bootstrap'
import '../EventCardComponent/EventCardStyles/EventCard.css'
export default class EventCardComponent extends Component {
  render() {
    return (
        <Container>
            <Card className='eventCard'>
                <Card.Header className = 'eventCardHeader'>
                    <div className = 'eventCardHeaderDetails row'>
                        <img className='eventCardHeaderDetail eventHostPFP col' 
                        src='https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.pinimg.com%2F736x%2F8b%2F16%2F7a%2F8b167af653c2399dd93b952a48740620.jpg&f=1&nofb=1&ipt=33608bf0973b950d8a9032fd47b796c156c60bf3f6edf4b174dc2947f2d9b4da&ipo=images'/>
                        <p className='eventCardHeaderDetail eventHost col'>Martin Yordanov</p>
                        <p className='eventCardHeaderDetail eventType col'>Public</p>
                        <p className='eventCardHeaderDetail eventClass col'>Tech</p>
                        <p className='eventCardHeaderDetail eventCredits col'> <FontAwesomeIcon icon = {faTag}/> 15 Attendance Credits</p>
                    </div>
                </Card.Header>
                <Card.Body className = 'eventCardBody'>
                    <Card.Title className='eventCardTitle'>Artificial Intellgence outlooks</Card.Title>
                    <Card.Subtitle className='eventCardDescription'>Is artificial intelligence that dang...</Card.Subtitle>

                </Card.Body>
                <Card.Footer className = 'eventCardFooter'>
                    <Button className='learnMore btn'>Learn more</Button>
                    <Button className='Attend btn'>Attend</Button>
                </Card.Footer>
            </Card>
        </Container>
    )
  }
}
