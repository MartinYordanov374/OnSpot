import Axios from 'axios'
import React, { Component } from 'react'
import { Container, Button,Card, } from 'react-bootstrap'
import NavbarComponentRegisteredUser from '../NavbarComponent/NavbarComponentRegisteredUser'
import SidebarComponent from '../SidebarComponent/SidebarComponent'
import './ProfilePageStyles/ProfilePageStyle.css'
export default class ProfilePageComponent extends Component {

  constructor()
  {
    super()
    this.splittedUrl = window.location.href.split('/')
    this.targetID = this.splittedUrl[this.splittedUrl.length - 1]
    this.state = {userData: [], userProfilePicture: ''}
  }
  componentDidMount()
  {
    Axios.post(`http://localhost:3030/getUserDataById/${this.targetID}`, {}, {withCredentials: true})
    .then((res) => {
        this.setState({userData: res.data})
    })
    .catch((err) => console.log(err))
  }

  handleSelectProfilePicture = () => {
    let coverInputField = document.querySelector('.coverUpload')
    coverInputField.click()
    console.log(this.state)
  }


  render() {
    return (
        <div>
        <SidebarComponent/>
        
        <Container>
            <NavbarComponentRegisteredUser/>
            <div className='profilePageWrapper'>
                <div className='profilePageBackgroundImage' onClick={() => this.handleSelectProfilePicture()}>
                    <img 
                        src='https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.pinimg.com%2F736x%2F8b%2F16%2F7a%2F8b167af653c2399dd93b952a48740620.jpg&f=1&nofb=1&ipt=33608bf0973b950d8a9032fd47b796c156c60bf3f6edf4b174dc2947f2d9b4da&ipo=images' 
                        className='userPFP'
                        
                    />
                    <input type="file" className="coverUpload" hidden onChange={(e) => this.setState({'userProfilePicture': e.target.value})}/>
                </div>
                <div className='profilePageUserDetails d-flex'>
                    <div className='row'>
                        <span className='username col'>{this.state.userData.Username} </span>
                        <span className='followers'>{this.state.userData.Followers} followers</span>
                        {/* <span className='username col'>{this.state.userData.Bio} </span> */}
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
        </div>
    )
  }
}
