import React, { Component } from 'react'
import { Container, Button,Card, Carousel, CarouselItem } from 'react-bootstrap'
import NavbarComponentRegisteredUser from '../NavbarComponent/NavbarComponentRegisteredUser'
import SidebarComponent from '../SidebarComponent/SidebarComponent'
import './EventPageStyles/EventPageStyling.css'
import Axios from 'axios'
import NonRegisteredLandingPage from '../LandingPageComponent/NonRegisteredLandingPage'
import MapComponent from '../MapComponent/MapComponent'

export default class EventPageComponent extends Component {
    constructor()
    {
        super()
        this.state = {
            targetEventName: '', 
            targetEventClass: '', 
            targetEventType: '', 
            targetEventDesc: '', 
            targetEventLocation: '', 
            targetEventStartDate: '', 
            targetEventEndDate: '',
            targetEventHostUsername: '', 
            targetEventHostId: '', 
            targetEventHostBio: '', 
            targetEventID: '', 
            targetEventImages: 
            [

                'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwallpaperaccess.com%2Ffull%2F229814.jpg&f=1&nofb=1&ipt=6ef7e87366a7594e6aa872f1e77969fde626b06c216c750207295af4a77b0aff&ipo=images',
                'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fhdqwalls.com%2Fdownload%2Fmarshmello-live-event-image-2560x1080.jpg&f=1&nofb=1&ipt=fe18caabc6022d88e04d82e1300e836a0363f5d0311c78f022f4344754db947f&ipo=images'
            ], 
            doesUserAttend: false, 
            loginStatus: false
        }
        this.splittedUrl = window.location.href.split('/')
        this.targetID = this.splittedUrl[this.splittedUrl.length - 1]
    }
    async GetTargetEventData()
    {
        
        let result = await Axios.get(`http://localhost:3030/getEventById/${this.targetID}`, {withCredentials: true})
        this.setState({
                    'targetEventName': result.data.EventName, 'targetEventClass': result.data.EventClass, 'targetEventType': result.data.EventType,
                    'targetEventDesc': result.data.EventDescription, 'targetEventLocaction': result.data.EventLocation,
                    'targetEventStartDate': result.data.EventStartDate.split('T')[0].split('-').join('/'), 'targetEventEndDate': result.data.EventEndDate.split('T')[0].split('-').join('/'),
                    'targetEventHostUsername': result.data.Username, 'targetEventHostId': result.data.id, 'targetEventHostBio': result.data.Bio == null ? "This user has not added any bio to their profile." : result.data.Bio,
                    'targetEventID': this.targetID })
        console.log(result)
    }

    async AttendEvent()
    {
        // TODO implement attend event API call here.
        Axios.post(`http://localhost:3030/attendEvent/${this.targetID}`, {}, {
          withCredentials: true})
        .then((res) => {
            if(res.data == 'You no longer attend this event!')
            {
                this.setState({'doesUserAttend': false})
            }
            else
            {
                this.setState({'doesUserAttend': true})
            }
        })
        .catch((err) => console.log(err))
        
    }
    async doesUserAttendEvent()
    {
        await Axios.post(`http://localhost:3030/doesUserAttendEvent/${this.targetID}`, {}, {withCredentials: true})
        .then((res) => {
            if(res.data == true)
            {
                this.setState({'doesUserAttend': true})
            }
            else
            {
                this.setState({'doesUserAttend': false})
            }
        })
        .catch((err) => {console.log(err)})
    }

    checkIfUserIsLoggedIn = async () => {
        await Axios.get('http://localhost:3030/isUserLoggedIn', {withCredentials: true})
        .then((res)=>{
          if(res.data == true)
          {
            
              this.setState({'loginStatus': true})
          }
          else
          {
            this.setState({'loginStatus': false})
          }})
      }
    componentDidMount()
    {

        this.GetTargetEventData()
        this.doesUserAttendEvent()
        this.checkIfUserIsLoggedIn()
    }
    render() {
    return (
        <div>
            {this.state.loginStatus == true ? 
            <div>
                <SidebarComponent/>
                <Container>
                <NavbarComponentRegisteredUser/>
                <Card className='eventCard'>
                        <Card.Header className = 'eventCardHeader'>
                            <h1>{this.state.targetEventName}</h1>
                        </Card.Header>
                        <div className='eventImagesCarousel'>
                            {/* TODO: CHECK IF IMAGES EXIST FOR THE GIVEN EVENT, IF THEY DO NOT THEN DISPLAY PLACEHOLDER IMAGES */}
                            <Carousel>
                                {this.state.targetEventImages.map((eventImage) => {
                                    return(
                                    <Carousel.Item>
                                        <img src= {eventImage} width='100%' height='426px'/>
                                    </Carousel.Item>)
                                })}
                            </Carousel>
                        </div>
                        <div className='eventDetailsMenu d-flex row'>
                            <p className='eventDetail col-lg-4'>{this.state.targetEventStartDate} - {this.state.targetEventEndDate}</p>
                            <p className='eventDetail col-lg-4'>{this.state.targetEventType == 0 ? "Public" : "Private"}</p>
                            <p className='eventDetail col-lg-4'>{this.state.targetEventClass}</p>
                            
                        </div>
                        <hr/>
                        <div className='row eventCardDescWrapper'>
                            <Card.Subtitle className='eventCardDescription col'>
                                <p>{this.state.targetEventDesc}</p>
                                <br></br>
                            </Card.Subtitle>
                                <div className='attendButtonWrapper col'>
                                    {this.state.doesUserAttend == false 
                                        ? 
                                        <Button className='attendButton' onClick={() => this.AttendEvent()}>Attend</Button>
                                        :
                                        <Button className='attendButton' onClick={() => this.AttendEvent()}>Unattend</Button>
                                    }
                                </div>
                            {/* <div className='col eventDetails'>
                                <p className=''>Event Topic: {this.state.targetEventClass}</p>
                                <p className='' >Event type: {this.state.targetEventType == 0 ? "Public" : "False"}</p>
                            </div> */}


                        </div>
                        <hr/>
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
                                <p>Location:</p>
                                <MapComponent/>
                            </div>

                        </div>
                </Card>

                </Container> 
            </div>
            : 
            <NonRegisteredLandingPage/>
            }
        </div>

    )
  }
}
