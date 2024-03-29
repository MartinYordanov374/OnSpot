import React, { Component } from 'react'
import { Button, FormControl,Modal } from 'react-bootstrap'
import Axios from 'axios'
import SidebarComponent from '../SidebarComponent/SidebarComponent'
import './Styles/SettingsStyles.css'
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Buffer } from 'buffer';
import LandingPageComponent from '../LandingPageComponent/LandingPageComponent'
import { faAngleRight, faBan, faCircleXmark, faCog, faSquareXmark, faTrash, faUserCircle, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
export default class Settings extends Component {

  constructor()
  {
    super()
    this.state = {
      isProfileSelected: true,
      isPasswordSelected: false,
      isBlockedUsersSelected: false,
      isDeleteProfileSelected: false,
      blockedUsersList: [
        {'username': 'testBlock1'}, 
        {'username': 'testBlock2'},
        {'username': 'testBlock3'}, 
        {'username': 'testBlock4'}, 
        {'username': 'testBlock5'}, 
      ],
      currentUsername : '',
      currentEmail : '',
      currentBio : '',
      currentUserID: -1,
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
      loginStatus: false,
      isModalShown: false,
    }
  }

  selectProfile = () => {
    this.setState(
      {
        'isProfileSelected':  true, 
        'isPasswordSelected': false,
        'isBlockedUsersSelected': false,
        'isDeleteProfileSelected': false,
        'isPasswordSelected': false
      }
    )
  }
  selectPassword = () => {
    this.setState(
      {
        'isProfileSelected':  false, 
        'isPasswordSelected': true,
        'isBlockedUsersSelected': false,
        'isDeleteProfileSelected': false,
        'isPasswordSelected': false
      }
    )
  }
  selectDeleteProfile = () => {
    this.setState(
      {
        'isProfileSelected':  false, 
        'isPasswordSelected': false,
        'isBlockedUsersSelected': false,
        'isDeleteProfileSelected': true,
        'isPasswordSelected': false
      }
    )
  }
  selectBlockedUsers = () => {
    this.setState(
      {
        'isProfileSelected':  false, 
        'isPasswordSelected': false,
        'isBlockedUsersSelected': true,
        'isDeleteProfileSelected': false,
        'isPasswordSelected': false
      }
    )
  }
  selectPassword = () => {
    this.setState(
      {
        'isProfileSelected':  false, 
        'isPasswordSelected': false,
        'isBlockedUsersSelected': false,
        'isDeleteProfileSelected': false,
        'isPasswordSelected': true
      }
    )
  }

  getUserData = async() => {
    await Axios.get(`http://localhost:3030/getUserData`, {withCredentials: true})
    .then((res) => {
      let currentUserdata = res.data[0]
      this.setState({
        'currentUsername': currentUserdata.Username,
        'currentEmail': currentUserdata.Email,
        'currentBio': currentUserdata.bio,
        'currentUserID': currentUserdata.id
      })
    })
  }
  updateProfileData = async() => {
    //TODO: Do not change unchanged fields
    await Axios.post(`http://localhost:3030/updateUsername/${this.state.currentUserID}`, 
    {'username': this.state.currentUsername}, 
    {withCredentials: true})
    .then((res) => {
      toast.success(res.data)
    })
    .catch((err) => {
      toast.warn(err)
    })

    await Axios.post(`http://localhost:3030/updateEmail/${this.state.currentUserID}`, 
    {'email': this.state.currentEmail}, 
    {withCredentials: true})
    .then((res) => {
      toast.success(res.data)
    })
    .catch((err) => {
      toast.warn(err)
    })


    await Axios.post(`http://localhost:3030/updateBio/${this.state.currentUserID}`, 
    {'bio': this.state.currentBio}, 
    {withCredentials: true})
    .then((res) => {
      toast.success(res.data)
    })
    .catch((err) => {
      toast.warn(err)
    })

      setTimeout(() => {
        window.location.reload()
      }, 6000);

  }

  deleteProfile = async() => {
    // TODO: DELETE EVERYTHING RELATED TO THAT USER OR REPLACE IT WITH [DELETED USER]
    let result = await Axios.delete(`http://localhost:3030/deleteProfile/${this.state.currentUserID}`, {withCredentials: true })
    .then((res) => {
    })
    .catch((err) => {
      console.log(err)
    })
    window.location.href = '/'

  }

  componentDidMount = () => {
    this.checkIfUserIsLoggedIn()
    this.getUserData()
    this.getBlockedUsers()
  }

  getBlockedUsers = async() => {
    let result = await Axios.get('http://localhost:3030/getBlockedUsers', {withCredentials: true})
    let blockedUsers = result.data.users.blockedUsersList.recordset
    this.setState({'blockedUsersList': blockedUsers})
  }

  unblockUser = async(blockedUserID) => {
    let result = await Axios.post(`http://localhost:3030/unblockUser/${blockedUserID}`, {}, {withCredentials: true})
    this.getBlockedUsers()
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

  componentDidUpdate()
  {
    this.checkIfUserIsLoggedIn()
  }

  handleCloseModal = () => {
    this.setState({'isModalShown':false})
  }

  confirmDeleteProfile = async() => {
    this.setState({'isModalShown':true})
  }
  render() { 
    return (
      // TODO: Auth guard !
      <div className='settingsPageWrapper'>
        {this.state.loginStatus == true ?
          <div>
            <SidebarComponent/>
            <ToastContainer/>
            <div className='settingsContainer'>
              <div className='settingsSideMenu'>
                  <div className='settingsHeaderWrapper'>
                    <h2> <FontAwesomeIcon icon={faCog}/>Settings</h2>
                  </div>
                  <div className='sideMenuOption' onClick={() => this.selectProfile()}>
                    <FontAwesomeIcon className = 'sideMenuOptionLeftIcon' icon={faUserCircle}/>
                    Edit profile
                    <FontAwesomeIcon className = 'sideMenuOptionRightAngleIcon' icon={faAngleRight}/>
                  </div>
                <div className='sideMenuOption' onClick={() => this.selectBlockedUsers()}>
                  <FontAwesomeIcon className = 'sideMenuOptionLeftIcon' icon={faBan}/>
                  Blocked users 
                  <FontAwesomeIcon className = 'sideMenuOptionRightAngleIcon' icon={faAngleRight}/>
                </div>
                <div className='sideMenuOption' onClick={() => this.selectDeleteProfile()}>
                  <FontAwesomeIcon className = 'sideMenuOptionLeftIcon' icon={faCircleXmark}/>
                  Delete profile
                  <FontAwesomeIcon className = 'sideMenuOptionRightAngleIcon' icon={faAngleRight}/>
                </div>
              </div>

              {this.state.isProfileSelected == true ?
                <div className='profileSectionContainer section'>
                  <h4 className='sectionHeader'>Edit profile</h4>
                  <div className='inputFieldWrapper d-flex'>
                    <p className='label'>Username</p>
                    <FormControl placeholder='Change username' className='changeUsername inputField' value = {this.state.currentUsername}
                    onChange={(e) => this.setState({'currentUsername': e.target.value})}/>
                  </div>

                  <div className='inputFieldWrapper d-flex'>
                    <p className='label'>Email</p>
                    <FormControl placeholder='Change Email' className='changeEmail inputField' value = {this.state.currentEmail} 
                    onChange={(e) => this.setState({'currentEmail': e.target.value})}/>
                  </div>

                  <Button className='saveBtn button' onClick={() => this.updateProfileData()}>Save</Button>

                </div>
                :
                ""
              }
              
              {this.state.isBlockedUsersSelected == true ?
              <div className='blockedUsersSectionContainer section'>
                <div>
                  <h4 className='sectionHeader'>Blocked users</h4>

                  {this.state.blockedUsersList.length >= 1 ?
                    this.state.blockedUsersList.map((blockedUser) => {
                      return(
                        <div className='blockedUserContainer d-flex'>
                          {blockedUser.ProfilePicture 
                            ?
                              <img 
                                  src={
                                    `data: image/png;base64,
                                    ${Buffer.from(blockedUser.ProfilePicture.data).toString('base64')}`
                                    }
                                  className='blockedUserPFP'
                              />
                            :
                              <img 
                                src={`https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.pinimg.com%2F736x%2F8b%2F16%2F7a%2F8b167af653c2399dd93b952a48740620.jpg&f=1&nofb=1&ipt=33608bf0973b950d8a9032fd47b796c156c60bf3f6edf4b174dc2947f2d9b4da&ipo=images`}
                                className='blockedUserPFP'
                              />
                          }
                          <h5 className='blockedUsername'>{blockedUser.Username}</h5>
                          <p className='ms-auto unblockButton' onClick={() => this.unblockUser(blockedUser.BlockedUserID)}>Unblock</p>
                        </div>
                      )
                    })
                  : 
                    <div className='noBlockedUsersMessage'>
                      <p>You haven't blocked anybody.</p>
                    </div>
                  }
                </div>
              </div>
                :
                ""
              }

              {this.state.isDeleteProfileSelected == true ?
                <div className='deleteProfileSectionContainer section'>
                  <h4 className='sectionHeader'>Delete profile</h4>
                  <Button className='deleteProfile button btn-danger' onClick={() => this.confirmDeleteProfile()}>Delete my profile.</Button>
                 <Modal show={this.state.isModalShown} onHide={this.handleCloseModal}>
                      <Modal.Header closeButton>
                        <Modal.Title>You're about to delete your account!</Modal.Title>
                      </Modal.Header>

                      <Modal.Body>
                        <p>This is an irreversible action, are you sure you want to delete your account?</p>
                      </Modal.Body>

                      <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.handleCloseModal()}>Close</Button>
                        <Button variant="danger" onClick={() => {this.deleteProfile()}}>Confirm</Button>
                      </Modal.Footer>
                  </Modal>
                </div>
                :
                ""
              }

            </div>
          </div>
          :
          <LandingPageComponent/>
        }
        
      </div>
    )
  }
}
