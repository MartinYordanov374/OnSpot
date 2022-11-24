import React, { Component } from 'react'
import { Container, Button,Card, } from 'react-bootstrap'
import NavbarComponentRegisteredUser from '../NavbarComponent/NavbarComponentRegisteredUser'
import './EventPageStyles/EventPageStyling.css'
export default class EventPageComponent extends Component {
  render() {
    return (
      <Container>
          <NavbarComponentRegisteredUser/>
          <Card className='eventCard'>
                <Card.Header className = 'eventCardHeader'>
                    <h1>Artificial intelligence outlooks</h1>
                </Card.Header>
                <div className='row eventCardDescWrapper'>
                    <Card.Subtitle className='eventCardDescription col'>
                        Is AI that dangerous technology that people have been warning us about for decades or have we been fooled?
                        <br></br>
                        <div className='attendButtonWrapper'>
                            <Button className='attendButton'>Attend</Button>
                        </div>
                    </Card.Subtitle>
                    <div className='col eventDetails'>
                        <p className=''>Event Topic: Tech</p>
                        <p className='' >Event type: Public</p>
                    </div>


                </div>
                <div className='row'>
                    <div className='col eventHostData'>
                        <div className='d-flex eventHostDataContainer'>
                            <img 
                            src='https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.pinimg.com%2F736x%2F8b%2F16%2F7a%2F8b167af653c2399dd93b952a48740620.jpg&f=1&nofb=1&ipt=33608bf0973b950d8a9032fd47b796c156c60bf3f6edf4b174dc2947f2d9b4da&ipo=images'
                            className='eventHostPfp'/>
                            <h3 className='eventHostName'>Martin Yordanov</h3>

                        </div>
                        <p className='eventHostBio'>Martin Yordanov is an AI enthusiast with a humble experience in AI.</p>

                    </div>
                    <div className='mapWrapper col'>
                        <p>This is where the map will be</p>
                    </div>

                </div>
          </Card>

      </Container>
    )
  }
}
