import React, { Component } from 'react'
import { Container, Button,Card, Carousel, CarouselItem } from 'react-bootstrap'
import SidebarComponent from '../SidebarComponent/SidebarComponent'
import './EventPageStyles/EventPageStyling.css'
import Axios from 'axios'
import NonRegisteredLandingPage from '../LandingPageComponent/NonRegisteredLandingPage'
import MapComponent from '../MapComponent/MapComponent'
import { Buffer } from 'buffer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisH } from "@fortawesome/free-solid-svg-icons";

export default class EventPageComponent extends Component {
    // TODO: ADD A LOADING SCREEN UNTIL ALL THE STATE DATA IS LOADED
    constructor()
    {
        super()
        this.date = new Date();
        this.state = {
            targetEventName: '', 
            targetEventClass: '', 
            targetEventType: '', 
            targetEventDesc: '', 
            targetEventLocation: '', 
            targetEventStartDate: '', 
            targetEventEndDate: '',
            targetEventHostUsername: '', 
            targetEventHostProfilePicture: '',
            targetEventHostId: '', 
            targetEventHostBio: '', 
            targetEventID: '', 
            targetEventImages: 
            [

                'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwallpaperaccess.com%2Ffull%2F229814.jpg&f=1&nofb=1&ipt=6ef7e87366a7594e6aa872f1e77969fde626b06c216c750207295af4a77b0aff&ipo=images',
                'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fhdqwalls.com%2Fdownload%2Fmarshmello-live-event-image-2560x1080.jpg&f=1&nofb=1&ipt=fe18caabc6022d88e04d82e1300e836a0363f5d0311c78f022f4344754db947f&ipo=images'
            ], 
            doesUserAttend: false, 
            loginStatus: false,
            currentDate: this.date,
            isLoading: true,
            isUserHoster: false
        }
        this.splittedUrl = window.location.href.split('/')
        this.targetID = this.splittedUrl[this.splittedUrl.length - 1]
    }
    async GetTargetEventData()
    {
        
        await Axios.get(`http://localhost:3030/getEventById/${this.targetID}`, {withCredentials: true})
        .then((res) => {
            this.setState({
                'targetEventName': res.data.EventName, 'targetEventClass': res.data.EventClass, 'targetEventType': res.data.EventType,
                'targetEventDesc': res.data.EventDescription, 'targetEventLocaction': res.data.EventLocation,
                'targetEventStartDate': res.data.EventStartDate.split('T')[0].split('-').join('/'), 'targetEventEndDate': res.data.EventEndDate.split('T')[0].split('-').join('/'),
                'targetEventHostUsername': res.data.Username, 'targetEventHostId': res.data.id, 'targetEventHostBio': res.data.Bio == null ? "This user has not added any bio to their profile." : res.data.Bio,
                'targetEventID': this.targetID, 'targetEventHostProfilePicture': res.data.ProfilePicture 
            })
            this.CheckIfUserIsOwner()
            this.setState({'isLoading': false})
        })
    }

    async CheckIfUserIsOwner()
    {
        await Axios.get(`http://localhost:3030/isUserEventOwner/${this.targetID}`, {withCredentials: true})
        .then((res) => {
            if(res.data.isUserOwner == true)
            {
                this.setState({'isUserHoster': true})
            }
            else
            {
                this.setState({'isUserHoster': false})
            }
        })
        .catch((err) => {
            // console.log(err)
        })
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
            {this.state.isLoading == false ? 
            <div>
                {this.state.loginStatus == true ? 
                <div>
                    <SidebarComponent/>
                    <Container>
                    {/* <NavbarComponentRegisteredUser/> */}
                    <Card className='eventCard'>
                            <Card.Header className = 'eventCardHeader'>
                                <h1>{this.state.targetEventName}</h1>
                                {this.state.isUserHoster == true ?
                                    <FontAwesomeIcon icon={faEllipsisH} className = 'dotsMenu'/>
                                : 
                                ""}
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
                                {new Date(new Date(this.state.targetEventEndDate).toDateString()) >= new Date(new Date().toDateString()) ?
                                    <div className='attendButtonWrapper col'>
                                        {this.state.doesUserAttend == false 
                                            ? 
                                            <Button className='attendButton' onClick={() => this.AttendEvent()}>Attend</Button>
                                            :
                                            <Button className='attendButton' onClick={() => this.AttendEvent()}>Unattend</Button>
                                        }
                                    </div>
                                    :
                                    <div className='attendButtonWrapper col'>
                                        <Button className='attendButton' disabled = {true}>This event has ended.</Button>
                                        
                                    </div>
                                }
                            </div>
                            <hr/>
                            <div className='row'>
                                <div className='col eventHostData'>
                                    <div className='d-flex eventHostDataContainer'>
                                        <a href={`/Profile/${this.state.targetEventHostId}`} className='eventDetailComponentLink'>
                                            <img 
                                                src={
                                                    `data: image/png;base64,
                                                    ${Buffer.from(this.state.targetEventHostProfilePicture.data).toString('base64')}`
                                                    }
                                                className='eventHostPfp'
                                            />
                                        </a>
                                       <a href={`/Profile/${this.state.targetEventHostId}`} className='eventDetailComponentLink'>
                                        <h3 className='eventHostName'>{this.state.targetEventHostUsername}</h3>
                                       </a> 
                                    </div>
                                    <p className='eventHostBio'>{this.state.targetEventHostBio}</p>

                                </div>
                                <div className='mapWrapper col'>
                                    <p>Location:</p>
                                    <MapComponent props = {this.state.targetEventLocaction}/>
                                </div>

                            </div>
                    </Card>

                    </Container> 
                </div>
                : 
                <NonRegisteredLandingPage/>
                }
            </div>
            :
            ""}
        </div>

    )
  }
}
