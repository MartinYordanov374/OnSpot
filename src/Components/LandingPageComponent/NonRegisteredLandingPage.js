import React, { Component } from 'react'
import NavbarComponentNotRegisteredUser from '../NavbarComponent/NavbarComponentNotRegisteredUser'
import { faMapMarkedAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Container } from 'react-bootstrap'
import conversation from '../../Images/conversation.png'

export default class NonRegisteredLandingPage extends Component {
  render() {
    return (
        <div>
            <NavbarComponentNotRegisteredUser/>
            <Container>
                <div className='row'>
                    <div className='welcomeText firstWelcomeText col-sm-6 col-md-6'>
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
                    <div className='welcomeText weclomeTextNonRegistered col-sm-6 col-md-6'>
                    <p>Your best networking partner; even introverts use it.</p>
                    </div>
                </div>
            </Container>
        </div>
    )
  }
}

