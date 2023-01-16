import Axios from 'axios'
import React, { Component } from 'react'
import { Container, Button,Card, } from 'react-bootstrap'
import { Buffer } from 'buffer';
import NavbarComponentRegisteredUser from '../NavbarComponent/NavbarComponentRegisteredUser'
import SidebarComponent from '../SidebarComponent/SidebarComponent'
import './ProfilePageStyles/ProfilePageStyle.css'
import NonRegisteredLandingPage from '../LandingPageComponent/NonRegisteredLandingPage';
import ChatBoxModalComponent from '../ChatboxModalComponent/ChatBoxModalComponent';
export default class ProfilePageComponent extends Component {

  constructor()
  {
    super()
    this.state = {
      userData: [], 
      currentUserData: [], 
      isCurrentUserOwner: false, 
      isLoading: true, 
      loginStatus: false, 
      userFollowsProfile: false,
      isChatModalShown: false,
      userFollowersIDList: [],
      userFollowersList: []
    }
  }
  // TODO: FIX THE FOLLOW BUTTON DISPLAY
  // REMOVE FOLLOW AND MESSAGE OPTION IF USER IS OWNER OF THE PROFILE
  // REMOVE CHANGE PFPF IF USER IS NOT OWNER OF THE PROFILE
  checkIfUserIsLoggedIn = async () => {
    await Axios.get('http://localhost:3030/isUserLoggedIn', {withCredentials: true})
    .then((res)=>{
      if(res.data == true)
      {
          this.setState({'loginStatus': true})
          this.checkIfUserFollowsProfile()
          this.checkIfUserIsOwner()
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
      this.setState({'userData': res.data})
      this.checkIfUserIsLoggedIn()
      this.setState({'isLoading': false})
      this.getUserFollowers(this.targetID)
    })
    .catch((err) => {
      console.log(err)
    })
  }

  handleSelectProfilePicture = () => {
    let profileImageInputField = document.querySelector('.profileImageUpload')
    console.log(profileImageInputField)
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

  followUser = async()=>{
    let followedUserID = this.targetID
    let result = Axios.post(`http://localhost:3030/followUser/${followedUserID}`, {}, {withCredentials: true})
    .then((res) => {
       this.checkIfUserFollowsProfile()
    })
  }

  checkIfUserFollowsProfile = async() => {
    await Axios.get(`http://localhost:3030/getUserData`, {withCredentials: true})
    .then((res) => {
      let currentUserID = res.data[0].id
      if(this.state.userData.Followers.length >= 1)
      {
        this.state.userData.Followers.some((follower) => {
          if(follower.FollowerUserID == currentUserID) 
          {
            this.setState({'userFollowsProfile': true})
          }
          else
          {
            this.setState({'userFollowsProfile': false})
          }
        })
      }
      else
      {
        this.setState({'userFollowsProfile': false})
      }

    })
  }

  checkIfUserIsOwner = async() => {

    await Axios.get('http://localhost:3030/getUserData', {withCredentials: true})
    .then((res)=>{
      this.setState({'currentUserData':res.data[0]})  
      this.splittedUrl = window.location.href.split('/')
      this.targetID = this.splittedUrl[this.splittedUrl.length - 1]
      if(Number(res.data[0].id) == Number(this.targetID))
      {
        this.setState({'isCurrentUserOwner':true})
      }
      else
      {
        this.setState({'isCurrentUserOwner':false})
      }
    })
  }

  handleChatBoxModal = async() => {
    if(this.state.isChatModalShown == true)
    {
      this.setState({'isChatModalShown': false})
    }
    else
    {
      this.setState({'isChatModalShown': true})
    }
  }

  getUserFollowers = async (targetUserID) => {
    await Axios.get(`http://localhost:3030/getUserFollowers/${targetUserID}`)
    .then((res) => {
      this.setState({'userFollowersIDList':res.data}, () => {
        this.state.userFollowersIDList.map(async(follower) => {
            await Axios.post(`http://localhost:3030/getUserDataById/${follower.FollowerUserID}`)
            .then((res) => {
              this.setState((prevState) => ({'userFollowersList':[...prevState.userFollowersList, res.data]}), () => {
                console.log(this.state.userFollowersList)
              })
            })
        })
      })
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
              {/* <NavbarComponentRegisteredUser/> */}
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
                      {this.state.isCurrentUserOwner == true ? 
                        <input type="file" className="profileImageUpload " hidden onChange={() => this.changeProfilePicture()}/>
                        : ""
                      }
                      </div>
                    <div className='profilePageUserDetails d-flex'>
                        <div className='row'>
                            <span className='username col'>{this.state.userData.Username} </span>
                            {this.state.userData.Followers ? 
                            <span className='followers'>{this.state.userData.Followers.length} followers</span>
                            :
                            <span className='followers'>0 followers</span>

                            }
                            {/* <span className='username col'>{this.state.userData.Bio} </span> */}
                        </div>
                        
                        {this.state.isCurrentUserOwner == false ?
                        <div className='row userInteractionBtns'>
                              <span className='messageUser col' onClick = {() => this.handleChatBoxModal()}>Message</span>
                              {
                                this.state.userFollowsProfile == true ? 
                                <span className='followUser col' onClick={() => this.followUser()}>
                                  Following
                                </span>
                                : 
                                <span className='followUser col' onClick={() => this.followUser()}>
                                  Follow
                                </span>
                              }
                        </div>
                       : 
                       "" }     
                    </div>
                    <div className='userEvents'>
                        {/* I should probably include what the user attended as well?? */}
                        <h1 className='userActivityHeader'>Latest Activity</h1>
                        <div className='EventsActivity'>
                            
                        </div>
                    </div>
                    {
                      this.state.isChatModalShown == true ?
                      <ChatBoxModalComponent props = {{'isModalShown': true, 'modalHandler':this.handleChatBoxModal, 'senderData': this.state.currentUserData, 'receiverData': this.state.userData}}/>
                      :
                      <ChatBoxModalComponent props = {{'isModalShown': false, 'modalHandler':this.handleChatBoxModal, 'senderData': this.state.currentUserData, 'receiverData': this.state.userData}}/>
                    }
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
