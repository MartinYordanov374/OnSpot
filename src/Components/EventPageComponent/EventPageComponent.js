import React, { Component } from 'react'
import { Container, Button,Card, } from 'react-bootstrap'
import NavbarComponentRegisteredUser from '../NavbarComponent/NavbarComponentRegisteredUser'

export default class EventPageComponent extends Component {
  render() {
    return (
      <Container>
          <NavbarComponentRegisteredUser/>
          <Card className='eventCard'>
                <Card.Header className = 'eventCardHeader'>
                    <h1>Artificial intelligence outlooks</h1>
                </Card.Header>
                <div className='row'>
                    <Card.Subtitle className='eventCardDescription col'>
                        Is AI that dangerous technology that people have been warning us about for decades or have we been fooled?
                        <br></br>
                        <Button className='attendButton'>Attend</Button>
                    </Card.Subtitle>
                    <div className='col'>
                        <p className=''>Event Topic: Tech</p>
                        <p className='' >Event type: Public</p>
                    </div>


                </div>
                <h3>Martin Yordanov</h3>
                <p>Martin Yordanov is an AI enthusiast with a humble experience in AI.</p>
          </Card>   
      </Container>
    )
  }
}
