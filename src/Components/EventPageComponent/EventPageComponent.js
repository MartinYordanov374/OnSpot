import React, { Component } from 'react'
import { Container, Button,Card, Carousel } from 'react-bootstrap'
import SidebarComponent from '../SidebarComponent/SidebarComponent'
import './EventPageStyles/EventPageStyling.css'
import Axios from 'axios'
import NonRegisteredLandingPage from '../LandingPageComponent/NonRegisteredLandingPage'
import MapComponent from '../MapComponent/MapComponent'
import { Buffer } from 'buffer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisH, faTrash, faPen } from "@fortawesome/free-solid-svg-icons";
import DeleteEventModal from '../DeleteEventModal/DeleteEventModal'

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
            isUserHoster: false,
            isModalShown: false
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
            }, () => {
                this.SaveUserPreferences(this.state.targetEventType)
            })
            this.CheckIfUserIsOwner()
            this.setState({'isLoading': false})
        })
    }

    async SaveUserPreferences(EventType)
    {
        await Axios.post(`http://localhost:3030/saveUserPreference`, {EventType: EventType}, {withCredentials: true})
        .then((res) => {
            console.log(res)
        })
        .catch((err) => {
            console.log(err)
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
    showOwnerMenu = () => {
        let optionsDropdown = document.querySelector('.optionsDropdown')
        if(optionsDropdown.style.display == 'none')
        {
            optionsDropdown.style.display = 'block'
        }
        else
        {
            optionsDropdown.style.display = 'none'
        }
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

    handleDeleteModal = async() =>
    {
        if(this.state.isModalShown == true)
        {
          this.setState({'isModalShown': false})
        }
        else
        {
          this.setState({'isModalShown': true})
        }
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
                        {this.state.isModalShown == true 
                        ?
                            <DeleteEventModal props={{'isModalShown': true, 'modalHandler':this.handleDeleteModal, 'userID': this.state.targetEventHostId, 'eventID': this.state.targetEventID}}/>
                        :
                            <DeleteEventModal props={{'isModalShown': false, 'modalHandler':this.handleDeleteModal, 'userID': this.state.targetEventHostId, 'eventID': this.state.targetEventID}}/>
                        }
                   <Card className='eventCard'>
                            <Card.Header className = 'eventCardHeader row'>
                                <h1 className='eventHeader col-sm-2'>{this.state.targetEventName}</h1>
                                {this.state.isUserHoster == true ?
                                    <FontAwesomeIcon icon={faEllipsisH} className = 'dotsMenu col-sm-2' onClick={() => this.showOwnerMenu()}/>
                                    : 
                                ""}
                            </Card.Header>
                            <div className='optionsDropdown row' >
                                    <a href={`/EditEvent/${this.targetID}`} className='option col'>
                                        <FontAwesomeIcon icon={faPen}/>
                                        Edit
                                    </a>
                                    <span className='option col' onClick={()=>{this.handleDeleteModal()}}> 
                                        <FontAwesomeIcon icon={faTrash}/>
                                        Delete
                                    </span>
                                </div>
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
                                            {this.state.targetEventHostProfilePicture != null ?
                                            <img 
                                                src={
                                                    `data: image/png;base64,
                                                    ${Buffer.from(this.state.targetEventHostProfilePicture.data).toString('base64')}`
                                                    }
                                                className='eventHostPfp'
                                            />
                                            :
                                            <img 
                                                src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.pinimg.com%2F736x%2F8b%2F16%2F7a%2F8b167af653c2399dd93b952a48740620.jpg&f=1&nofb=1&ipt=33608bf0973b950d8a9032fd47b796c156c60bf3f6edf4b174dc2947f2d9b4da&ipo=images"
                                                className='eventHostPfp'
                                            />}
                                        </a>
                                       <a href={`/Profile/${this.state.targetEventHostId}`} className='eventDetailComponentLink'>
                                        <h3 className='eventHostName'>{this.state.targetEventHostUsername}</h3>
                                       </a> 
                                    </div>
                                    <p className='eventHostBio'>{this.state.targetEventHostBio}</p>

                                </div>
                                <div className='mapWrapper col'>
                                    <p>Location:</p>
                                    <p>{this.state.targetEventLocaction}</p>
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
