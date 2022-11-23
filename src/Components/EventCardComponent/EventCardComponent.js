import React, { Component } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Container,Card } from 'react-bootstrap'
export default class EventCardComponent extends Component {
  render() {
    return (
        <Container>
            <Card>
                <Card.Header>Event Header</Card.Header>
                <Card.Body>Event body</Card.Body>
                <Card.Footer>Event Footer</Card.Footer>
            </Card>
        </Container>
    )
  }
}
