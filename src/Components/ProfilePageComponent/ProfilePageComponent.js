import React, { Component } from 'react'
import { Container, Button,Card, } from 'react-bootstrap'
import NavbarComponentRegisteredUser from '../NavbarComponent/NavbarComponentRegisteredUser'
import './ProfilePageStyles/ProfilePageStyle.css'
export default class ProfilePageComponent extends Component {
  render() {
    return (
        <Container>
            <NavbarComponentRegisteredUser/>
            <div className='profilePageWrapper'>
                <div className='profilePageBackgroundImage'>
                    <img 
                        src='https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.pinimg.com%2F736x%2F8b%2F16%2F7a%2F8b167af653c2399dd93b952a48740620.jpg&f=1&nofb=1&ipt=33608bf0973b950d8a9032fd47b796c156c60bf3f6edf4b174dc2947f2d9b4da&ipo=images' 
                        className='userPFP'
                    />
                </div>
                <div className='profilePageUserDetails d-flex'>
                    <div className='row'>
                        <span className='username col'>Username </span>
                        <span className='followers'>0 followers</span>
                    </div>
                    <div className='row userInteractionBtns'>
                        <span className='messageUser col'>Message</span>
                        <span className='followUser col'>Follow</span>
                    </div>
                </div>
                <div className='userEvents'>
                    {/* I should probably include what the user attended as well?? */}
                    <h1 className='userActivityHeader'>Latest Activity</h1>
                    <div className='EventsActivity'>
                        
                    </div>
                </div>
            </div>
        </Container>
    )
  }
}
