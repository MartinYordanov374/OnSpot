import React, { Component } from 'react'
import NavbarComponentRegisteredUser from '../NavbarComponent/NavbarComponentRegisteredUser'
import NavbarComponentNotRegisteredUser from '../NavbarComponent/NavbarComponentNotRegisteredUser'
import { faMapMarkedAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Container } from 'react-bootstrap'
import conversation from '../../Images/conversation.png'
import './LandingPageStyles/LandingPage.css'
import EventCardComponent from '../EventCardComponent/EventCardComponent';
import SidebarComponent from '../SidebarComponent/SidebarComponent';
import Axios from 'axios'

export default class LandingPageComponent extends Component {
  constructor()
  {
    super()
    this.state = {loginStatus: false, events: []}
  }
  checkIfUserIsLoggedIn = async () => {
    await Axios.get('http://localhost:3030/isUserLoggedIn', {withCredentials: true})
    .then((res)=>{
      console.log(res.data)
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
    this.getEvents()
    this.checkIfUserIsLoggedIn()
  }
  getEvents = async () => {
    let events = await Axios.get('http://localhost:3030/getAllEvents', {withCredentials: true})
    .then((res) => {this.setState({'events': res.data.payload})})
    .catch((err) => {console.log(err)})
  }
  render() {
    
    return (
      <div>
        {this.state.loginStatus == false ?
        <div>
          <NavbarComponentNotRegisteredUser/>
          <Container>
          <div className='row'>
            <div className='welcomeText col-sm-6 col-md-6'>
              <p>Join a meeting you’re excited to attend anywhere, at any time.</p>
              <div className='signUpButtonWrapper'>
                <a href='/register' className='signUpButtonLink'> 
                  <p className = 'signUpButton'>Sign Up</p>
                </a>
              </div>
            </div>
            <div className='mapIcon col-sm-6 col-md-3'>
              <FontAwesomeIcon icon={faMapMarkedAlt} fontSize = '320px'/>
            </div>
          </div>
          <div className = 'row secondRow'>
            <div className = ' welcomeImageWrapper col-sm-6 col-md-6'>
              <img className = 'welcomeImage' src={conversation}/>
            </div>
            <div className='welcomeText col-sm-6 col-md-6'>
              <p>Your best networking partner; even introverts use it.</p>
            </div>
          </div>
          </Container>
        </div>
        :
        <div>
          <SidebarComponent/>
          <Container>
            <NavbarComponentRegisteredUser/>
            {this.state.events.map((event) => {
              return <EventCardComponent props={event}/>

            })}
            
          </Container>
        </div>
        }
      </div>
    )
  }
}
