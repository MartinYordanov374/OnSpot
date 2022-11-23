import React, { Component } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Container,Card } from 'react-bootstrap'
import '../EventCardComponent/EventCardStyles/EventCard.css'
export default class EventCardComponent extends Component {
  render() {
    return (
        <Container>
            <Card className='eventCard'>
                <Card.Header className = 'eventCardHeader'>Event Header</Card.Header>
                <Card.Body className = 'eventCardBody'>Event body</Card.Body>
                <Card.Footer className = 'eventCardFooter'>Event Footer</Card.Footer>
            </Card>
        </Container>
    )
  }
}
