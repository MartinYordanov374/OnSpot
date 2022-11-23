import React, { Component } from 'react'
import { Container, Button,Card, } from 'react-bootstrap'
import NavbarComponentRegisteredUser from '../NavbarComponent/NavbarComponentRegisteredUser'

export default class ProfilePageComponent extends Component {
  render() {
    return (
        <Container>
            <NavbarComponentRegisteredUser/>
            <div className='profilePageWrapper'>
                <div className='profilePageBackgroundImage'>

                </div>
                <div className='profilePageUserDetails d-flex'>
                    <img src='' className='userPFP'></img>
                    <div className='row'>
                        <span className='username col'>Username </span>
                        <span className='followers'>0 followers</span>
                    </div>
                    <div className='row'>
                        <span className='messageUser col'>Message</span>
                        <span className='followUser col'>Follow</span>
                    </div>
                </div>
                <div className='userEvents'>
                    {/* I should probably include what the user attended as well?? */}
                    <h1>Latest Events</h1>
                    <div className='EventsActivity'>
                        
                    </div>
                </div>
            </div>
        </Container>
    )
  }
}
