import Axios from 'axios'
import React, { Component } from 'react'
import { Container, Button,Card, } from 'react-bootstrap'
import { Buffer } from 'buffer';
import NavbarComponentRegisteredUser from '../NavbarComponent/NavbarComponentRegisteredUser'
import SidebarComponent from '../SidebarComponent/SidebarComponent'
import './ProfilePageStyles/ProfilePageStyle.css'
import NonRegisteredLandingPage from '../LandingPageComponent/NonRegisteredLandingPage';
export default class ProfilePageComponent extends Component {

  constructor()
  {
    super()
    this.state = {userData: [], isLoading: true, loginStatus: false}
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

  componentDidMount = () =>
  {
    this.splittedUrl = window.location.href.split('/')
    this.targetID = this.splittedUrl[this.splittedUrl.length - 1]
    Axios.post(`http://localhost:3030/getUserDataById/${this.targetID}`, {}, {withCredentials: true})
    .then((res) => {
        this.setState({userData: res.data})
        this.setState({'isLoading': false})
    })
    .catch((err) => {
      console.log(err)
    })

    this.checkIfUserIsLoggedIn()

  }

  handleSelectProfilePicture = () => {
    let profileImageInputField = document.querySelector('.profileImageUpload')
    profileImageInputField.click()
  }

  changeProfilePicture = () => {
    let profileImageInputField = document.querySelector('.profileImageUpload')
    let profileImage = profileImageInputField.files[0]
    let formData = new FormData()
    formData.append('pfp', profileImage)
    Axios.post('http://localhost:3030/changePfp', formData, {withCredentials: true})
    .then((res) => {
        console.log(res)
    })
    .catch((err) => {
        console.log(err)
    })
  }

  

  render() {
    return (
        <div>
        {
        this.state.loginStatus == true ? 
          <div>
          <SidebarComponent/>
          
          <Container>
              <NavbarComponentRegisteredUser/>
              {this.state.isLoading == false? 
                <div className='profilePageWrapper'>
                    <div className='profilePageBackgroundImage' onClick={() => this.handleSelectProfilePicture()}>
                        {this.state.userData.ProfilePicture.data 
                        ?
                          <img 
                              src={
                                `data: image/png;base64,
                                ${Buffer.from(this.state.userData.ProfilePicture.data).toString('base64')}`
                                }
                              className='userPFP'
                          />
                        :
                          <img 
                            src={`${this.state.userData.ProfilePicture}`}
                            className='userPFP'
                          />
                      }
                      <input type="file" className="profileImageUpload" hidden onChange={() => this.changeProfilePicture()}/>
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
                :
                <div>
                  <p>Loading</p>
                </div>
              }
          </Container>
          </div>
        :
        <NonRegisteredLandingPage/>  
      }
      </div>
    )
  }
}
