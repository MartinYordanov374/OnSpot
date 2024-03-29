import Axios from 'axios'
import React, { Component } from 'react'
import { Container, Button,Card, Dropdown, FormControl, InputGroup } from 'react-bootstrap'
import { Buffer } from 'buffer';
import SidebarComponent from '../SidebarComponent/SidebarComponent'
import './ProfilePageStyles/ProfilePageStyle.css'
import NonRegisteredLandingPage from '../LandingPageComponent/NonRegisteredLandingPage';
import ChatBoxModalComponent from '../ChatboxModalComponent/ChatBoxModalComponent';
import * as io from 'socket.io-client'
import ProfilePageActivitySection from './ProfilePageActivitySection';

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
      userFollowersList: [],
      posts: [],
      sharedPosts: [],
      allPostsData: [],
      commentContent: '',
      isModalShown: false,
      postImages: [],
      allUserPostImages: [],
      socket: io.connect('http://localhost:3030/')
    }
  }
    //TODO: IMPLEMENT INFINITE SCROLL FUNCTIONALITY
    componentDidMount = () =>
    {
      this.splittedUrl = window.location.href.split('/')
      this.targetID = this.splittedUrl[this.splittedUrl.length - 1]
      this.checkIfUserIsLoggedIn()
      this.getUserData()
    } 
    
    checkIfUserIsLoggedIn = async () => {
    this.splittedUrl = window.location.href.split('/')
    this.targetID = this.splittedUrl[this.splittedUrl.length - 1]
    await Axios.get('http://localhost:3030/isUserLoggedIn', {withCredentials: true})
    .then((res)=>{
      if(res.data == true)
      {
          this.setState({'loginStatus': true})
          this.checkIfUserIsOwner()
          this.checkIfUserFollowsProfile()
          
        }
      else
      {
        this.setState({'loginStatus': false})
      }})
    }

    componentDidUpdate()
    {
      this.checkIfUserIsLoggedIn()
    }

  getUserData = async() => {
    await Axios.post(`http://localhost:3030/getUserDataById/${this.targetID}`, {}, {withCredentials: true})
      .then((res) => {
        if(res.data.isUserBlocked)
        {
          window.location.href = '/'
        }
        this.setState({'userData': res.data}, () => {
          let allUserPostImages = this.state.userData.PostsImages.recordset
          let allUserPosts = this.state.userData.Posts.result.recordset
          let userSharedPosts = this.state.userData.SharedPosts.result.recordset
          this.setState({'posts': allUserPosts})
          this.setState({'sharedPosts': userSharedPosts})
          this.setState({'allPostsData': allUserPosts.concat(userSharedPosts)})
          this.setState({'userPostsImages': allUserPostImages})
          this.setState({'allUserPostImages': allUserPostImages})
          this.setState({'isLoading': false})

        })
      })
      .catch((err) => {
        console.log(err)
      })
  }
  handleSelectProfilePicture = () => {
    let profileImageInputField = document.querySelector('.profileImageUpload')
    profileImageInputField.click()
  }

  handleSelectBackgroundPicture = () => {
    let backgroundImageInputField = document.querySelector('.backgroundImageUpload')
    backgroundImageInputField.click()
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

  changeBackgroundPicture = () => {
    let backgroundImageInputField = document.querySelector('.backgroundImageUpload')
    let backgroundImage = backgroundImageInputField.files[0]
    let formData = new FormData()
    formData.append('pfp', backgroundImage)
    Axios.post('http://localhost:3030/changeBackgroundPicture', formData, {withCredentials: true})
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
      this.state.socket.emit('notify', {
        notificationData: {senderID: this.state.currentUserData.id, receiverID: this.targetID},
        isMessage: false,
        isPost: false,
        isFollower: true,
        isComment: false
      })
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

  blockUser = async () => {
    this.splittedUrl = window.location.href.split('/')
    this.targetID = this.splittedUrl[this.splittedUrl.length - 1]
    let result = await Axios.post(`http://localhost:3030/blockUser/${this.targetID}`, {}, {withCredentials: true})
    .then((res) => {
      console.log(res)
    })
    .catch((err) => {
      console.log(err)
    })
  }


  handleEditModal = () => {
    if(this.state.isModalShown == true )
    {
      this.setState({'isModalShown': false})
    }
    else
    {
      this.setState({'isModalShown': true})
    }
  }

  editPost = async(targetPostData) => {
    this.handleEditModal()
    let targetPost = targetPostData
    this.setState({'editedPostData': targetPost})
  }

  handleSelectPostImages = () => {
    let postImagesUploadField = document.querySelector('.postImagesUploadField')
    postImagesUploadField.click()
  }

  uploadPostImages = async() => {
    let postImagesUploadField = document.querySelector('.postImagesUploadField')
    let postImages = postImagesUploadField.files
    this.setState({'postImages': postImages})
}


  render() {
    return (
        <div>
        {
        this.state.loginStatus == true ? 
          <div>
          <SidebarComponent/>
          <Container>
              {this.state.isLoading == false? 
                <div className='profilePageWrapper'>
                    <div className='profilePageBackgroundImageWrapper'>
                    {this.state.userData.BackgroundPicture.data 
                        ?
                          <img 
                              src={
                                `data: image/png;base64,
                                ${Buffer.from(this.state.userData.BackgroundPicture.data).toString('base64')}`
                                }
                              className='userBackgroundPicture'
                              onClick={() => this.handleSelectBackgroundPicture()}
                          />
                        :
                          <img 
                            src={`${this.state.userData.BackgroundPicture}`}
                            className='userBackgroundPicture'
                            onClick={() => this.handleSelectBackgroundPicture()}
                          />
                      }
                        {this.state.userData.ProfilePicture.data 
                        ?
                          <img 
                              src={
                                `data: image/png;base64,
                                ${Buffer.from(this.state.userData.ProfilePicture.data).toString('base64')}`
                                }
                              className='userPFP'
                              onClick={() => this.handleSelectProfilePicture()}
                          />
                        :
                          <img 
                            src={`${this.state.userData.ProfilePicture}`}
                            className='userPFP'
                            onClick={() => this.handleSelectProfilePicture()}
                          />
                      }
                      {this.state.isCurrentUserOwner == true ? 
                        <input type="file" className="profileImageUpload " hidden onChange={() => this.changeProfilePicture()}/>
                        : ""
                      }
                      {this.state.isCurrentUserOwner == true ? 
                        <input type="file" className="backgroundImageUpload " hidden onChange={() => this.changeBackgroundPicture()}/>
                        : ""
                      }
                      </div>
                    <div className='profilePageUserDetails d-flex'>
                        <div className='row'>
                            <span className='username col'>{this.state.userData.Username} </span>
                            {this.state.userData.Followers ? 
                            <a className='followers' href={`/userFollowers/${this.targetID}`}>{this.state.userData.Followers.length} followers</a>
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
                                  Unfollow
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
                    <ProfilePageActivitySection props = {{
                      isCurrentUserOwner: this.state.isCurrentUserOwner, 
                      allPostsData: this.state.allPostsData,
                      userPostsImages: this.state.userPostsImages,
                      postImages: this.state.postImages,
                      isModalShown: this.state.isModalShown,
                      getUserDataFunction: this.getUserData, 
                      commentContent: this.state.commentContent,
                      handleSelectPostImages: this.handleSelectPostImages,
                      uploadPostImages: this.uploadPostImages,
                      currentUserData: this.state.currentUserData}}/>
                    {
                      this.state.isChatModalShown == true ?
                      <ChatBoxModalComponent props = {{'isModalShown': true, 'modalHandler':this.handleChatBoxModal, 'senderData': this.state.currentUserData, 'receiverData': this.state.userData}}/>
                      :
                      <ChatBoxModalComponent props = {{'isModalShown': false, 'modalHandler':this.handleChatBoxModal, 'senderData': this.state.currentUserData, 'receiverData': this.state.userData}}/>
                    }
                </div>
                :
                <div className='d-flex justify-content-center'>
                          <div class="spinner-border text-primary loadingSpinnerWrapper" role="status">
                            <span class="visually-hidden">Loading...</span>
                          </div>
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
