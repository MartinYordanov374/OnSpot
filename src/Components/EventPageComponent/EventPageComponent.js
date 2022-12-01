import React, { Component } from 'react'
import { Container, Button,Card, } from 'react-bootstrap'
import NavbarComponentRegisteredUser from '../NavbarComponent/NavbarComponentRegisteredUser'
import SidebarComponent from '../SidebarComponent/SidebarComponent'
import './EventPageStyles/EventPageStyling.css'
import Axios from 'axios'

export default class EventPageComponent extends Component {
    constructor()
    {
        super()
        this.state = {targetEventName: '', targetEventClass: '', targetEventType: '', 
        targetEventDesc: '', targetEventLocation: '', targetEventDate: '',
        targetEventHostUsername: '', targetEventHostId: '', targetEventHostBio: ''}
    }
    async GetTargetEventData()
    {
        let splittedUrl = window.location.href.split('/')
        let targetID = splittedUrl[splittedUrl.length - 1]
        
        let result = await Axios.get(`http://localhost:3030/getEventById/${targetID}`)
        this.setState({'targetEventName': result.data.EventName, 'targetEventClass': result.data.EventClass, 'targetEventType': result.data.EventType,
                    'targetEventDesc': result.data.EventDescription, 'targetEventLocaction': result.data.EventLocation, 'targetEventDate': result.data.EventDate,
                    'targetEventHostUsername': result.data.Username, 'targetEventHostId': result.data.id, 'targetEventHostBio': result.data.Bio == null ? "This user has not added any bio to their profile." : result.data.Bio })
        }
    componentDidMount()
    {
        this.GetTargetEventData()
    }
    render() {
    return (
        <div>
        <SidebarComponent/>
        <Container>
          <NavbarComponentRegisteredUser/>
          <Card className='eventCard'>
                <Card.Header className = 'eventCardHeader'>
                    <h1>{this.state.targetEventName}</h1>
                </Card.Header>
                <div className='row eventCardDescWrapper'>
                    <Card.Subtitle className='eventCardDescription col'>
                        {this.state.targetEventDesc}
                        <br></br>
                        <div className='attendButtonWrapper'>
                            <Button className='attendButton'>Attend</Button>
                        </div>
                    </Card.Subtitle>
                    <div className='col eventDetails'>
                        <p className=''>Event Topic: {this.state.targetEventClass}</p>
                        <p className='' >Event type: {this.state.targetEventType == 0 ? "Public" : "False"}</p>
                    </div>


                </div>
                <div className='row'>
                    <div className='col eventHostData'>
                        <div className='d-flex eventHostDataContainer'>
                            <img 
                            src='https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.pinimg.com%2F736x%2F8b%2F16%2F7a%2F8b167af653c2399dd93b952a48740620.jpg&f=1&nofb=1&ipt=33608bf0973b950d8a9032fd47b796c156c60bf3f6edf4b174dc2947f2d9b4da&ipo=images'
                            className='eventHostPfp'/>
                            <h3 className='eventHostName'>{this.state.targetEventHostUsername}</h3>

                        </div>
                        <p className='eventHostBio'>{this.state.targetEventHostBio}</p>

                    </div>
                    <div className='mapWrapper col'>
                        <p>This is where the map will be</p>
                    </div>

                </div>
          </Card>

        </Container> 
        </div>

    )
  }
}
