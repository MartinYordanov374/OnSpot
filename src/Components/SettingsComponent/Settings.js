import React, { Component } from 'react'
import { Button, FormControl } from 'react-bootstrap'
import Axios from 'axios'
import SidebarComponent from '../SidebarComponent/SidebarComponent'
import './Styles/SettingsStyles.css'
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Buffer } from 'buffer';

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
      confirmNewPassword: ''
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
    // TODO: Redirect to landing page after deletion
    let result = await Axios.delete(`http://localhost:3030/deleteProfile/${this.state.currentUserID}`, {withCredentials: true })
    .then((res) => {
    })
    .catch((err) => {
      console.log(err)
    })
  }

  componentDidMount = () => {
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
  render() { 
    return (
      // TODO: Auth guard !
      <div className='settingsPageWrapper'>
        <SidebarComponent/>
        <ToastContainer/>
        <div className='settingsContainer'>
          <div className='settingsSideMenu'>
            <p className='sideMenuOption' onClick={() => this.selectProfile()}>Edit profile</p>
            {/* <p className='sideMenuOption' onClick={() => this.selectPassword()}>Change password</p> */}
            <p className='sideMenuOption' onClick={() => this.selectBlockedUsers()}>Blocked users</p>
            <p className='sideMenuOption' onClick={() => this.selectDeleteProfile()}>Delete profile</p>
          </div>

          {this.state.isProfileSelected == true ?
            <div className='profileSectionContainer section'>
              <h1>Edit profile</h1>
              <div className='d-flex'>
                <p className='label'>Username</p>
                <FormControl placeholder='Change username' className='changeUsername inputField' value = {this.state.currentUsername}
                onChange={(e) => this.setState({'currentUsername': e.target.value})}/>
              </div>

              <div className='d-flex'>
                <p className='label'>Email</p>
                <FormControl placeholder='Change Email' className='changeEmail inputField' value = {this.state.currentEmail} 
                onChange={(e) => this.setState({'currentEmail': e.target.value})}/>
              </div>
              <div className='d-flex'>
                <p className='label'>Bio</p>
                <textarea 
                class="form-control inputField" 
                id="exampleFormControlTextarea1" 
                rows="2" 
                placeholder='Enter bio'
                value = {this.state.currentBio}
                onChange={(e) => this.setState({'currentBio': e.target.value})}/>
              </div>

              <Button className='saveBtn button' onClick={() => this.updateProfileData()}>Save</Button>

            </div>
            :
            ""
          }
          
          {this.state.isBlockedUsersSelected == true ?
          <div>
            <div className='blockedUsersSectionContainer section'>
              <h1>Blocked users</h1>

              {this.state.blockedUsersList.length >= 1 ?
                this.state.blockedUsersList.map((blockedUser) => {
                  console.log(blockedUser)
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
              : "You haven't blocked anybody! Yay!"}
            </div>
          </div>
            :
            ""
          }

          {this.state.isDeleteProfileSelected == true ?
            <div className='deleteProfileSectionContainer section'>
              <h1>Delete profile</h1>
              <div className='d-block'>
                <h2>This is an irreversible action!</h2>

              </div>
                <Button className='deleteProfile button btn-danger' onClick={() => this.deleteProfile()}>Delete my profile.</Button>
            </div>
            :
            ""
          }

        </div>
        
      </div>
    )
  }
}
