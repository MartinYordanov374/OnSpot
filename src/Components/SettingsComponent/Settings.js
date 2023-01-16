import React, { Component } from 'react'
import { Button, FormControl } from 'react-bootstrap'

import SidebarComponent from '../SidebarComponent/SidebarComponent'
import './Styles/SettingsStyles.css'
export default class Settings extends Component {

  constructor()
  {
    super()
    this.state = {
      isProfileSelected: true,
      isPasswordSelected: false,
      isBlockedUsersSelected: false,
      isDeleteProfileSelected: false,
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
  render() {
    return (
      // TODO: Auth guard !
      <div className='settingsPageWrapper'>
        {/* <SidebarComponent/> */}
        <div className='settingsContainer'>
          <div className='settingsSideMenu'>
            <p className='sideMenuOption' onClick={() => this.selectProfile()}>Profile</p>
            <p className='sideMenuOption' onClick={() => this.selectPassword()}>Password</p>
            <p className='sideMenuOption' onClick={() => this.selectDeleteProfile()}>Delete profile</p>
            <p className='sideMenuOption' onClick={() => this.selectBlockedUsers()}>Blocked users</p>
            <p className='sideMenuOption' onClick={() => this.selectPassword()}>Password</p>
          </div>

          {this.state.isProfileSelected == true ?
            <div className='profileSectionContainer section'>

              <div className='d-flex'>
                <p className='label'>Username</p>
                <FormControl placeholder='Change username' className='changeUsername inputField'/>
              </div>

              <div className='d-flex'>
                <p className='label'>Email</p>
                <FormControl placeholder='Change Email' className='changeEmail inputField'/>
              </div>
              <div className='d-flex'>
                <p className='label'>Bio</p>
                <textarea 
                class="form-control inputField" 
                id="exampleFormControlTextarea1" 
                rows="2" 
                placeholder='Enter bio'
                />
              </div>

              <Button className='saveBtn'>Save</Button>

            </div>
            :
            ""
          }

          {this.state.isPasswordSelected == true ?
            <div className='passwordSectionContainer section'>
              Password
            </div>
            :
            ""
          }

          {this.state.isBlockedUsersSelected == true ?
            <div className='blockedUsersSectionContainer section'>
              Blocked
            </div>
            :
            ""
          }

          {this.state.isDeleteProfileSelected == true ?
            <div className='deleteProfileSectionContainer section'>
              Delete profile
            </div>
            :
            ""
          }

        </div>
        
      </div>
    )
  }
}
