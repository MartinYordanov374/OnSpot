import React, { Component } from 'react'
import { Button, FormControl } from 'react-bootstrap'
import Axios from 'axios'
import SidebarComponent from '../SidebarComponent/SidebarComponent'
import './Styles/SettingsStyles.css'
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    let result = await Axios.delete(`http://localhost:3030/deleteProfile/${this.state.currentUserID}`, {withCredentials: true })
    .then((res) => {
      console.log(res)
    })
    .catch((err) => {
      console.log(err)
    })
  }

  // handlePasswordChange = async() => {
  //   //1. Check if the current password is valid (on the back end)
  //     await Axios.post(`http://localhost:3030/checkUserPassword/${this.state.currentUserID}`, 
  //     {
  //       'pass': this.state.currentPassword,
  //     },
  //     {withCredentials: true})
  //     .then((res) => {
  //       if(res.data.status == 200)
  //       {
  //         toast.warn('The password you entered does not match your original')
  //       }
  //     })
  //     .catch((err) => {
  //       console.log(err)
  //     })
  //   //2. Check if the 2 fields for the new password match and if they are valid (back end validation)


  // }
  componentDidMount = () => {
    this.getUserData()
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

          {/* {this.state.isPasswordSelected == true ?
            <div className='passwordSectionContainer section'>
              <h1>Change password</h1>

              <div className='d-flex'>
                <p className='label'>Current password</p>
                <FormControl 
                  placeholder='Current password' 
                  className='changeEmail inputField' 
                  type = 'password' 
                  value = {this.state.currentPassword}
                  onChange={(e) => this.setState({'currentPassword': e.target.value})}
                />
              </div>
              <div className='d-flex'>
                <p className='label'>New password</p>
                <FormControl 
                  placeholder='New password' 
                  className='changeEmail inputField' 
                  type = 'password' 
                  value = {this.state.newPassword}
                  onChange={(e) => this.setState({'newPassword': e.target.value})}

                />
              </div>
              <div className='d-flex'>
                <p className='label'>Repeat new password</p>
                <FormControl 
                  placeholder='Repeat new password' 
                  className='changeEmail inputField' 
                  type = 'password' 
                  value = {this.state.confirmNewPassword}
                  onChange={(e) => this.setState({'confirmNewPassword': e.target.value})}

                />
              </div>
              <Button className='changePassBtn button' onClick={() => this.handlePasswordChange()}>Change password</Button>
            </div>
            :
            ""
          } */}

          {this.state.isBlockedUsersSelected == true ?
          <div>
            <div className='blockedUsersSectionContainer section'>
              <h1>Blocked users</h1>

              {this.state.blockedUsersList.length >= 1 ?
                this.state.blockedUsersList.map((blockedUser) => {
                  return(
                    <div className='blockedUserContainer d-flex'>
                      <p>{blockedUser.username}</p>
                      <p className='ms-auto unblockButton'>Unblock</p>
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
