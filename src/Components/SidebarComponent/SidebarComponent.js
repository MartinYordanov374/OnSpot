import React, { Component } from 'react'
import './SidebarStyling/SidebarStyle.css'
import { faCog, faSignOut } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Buffer } from 'buffer';
import Axios from 'axios'

export default class SidebarComponent extends Component {
  constructor()
  {
    super()
    this.state = {username: '', userFollowers: 0, userID: 0, 
    ProfilePicture: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.pinimg.com%2F736x%2F8b%2F16%2F7a%2F8b167af653c2399dd93b952a48740620.jpg&f=1&nofb=1&ipt=33608bf0973b950d8a9032fd47b796c156c60bf3f6edf4b174dc2947f2d9b4da&ipo=images'}
  }
  async logOut(){
    await Axios.get('http://localhost:3030/logout', {withCredentials: true})
    window.location.href = '/'
  }
  async componentDidMount()
  {
    let returnedUserData = await Axios.get('http://localhost:3030/getUserData', {withCredentials: true})
    let targetUserData = returnedUserData.data[0]
    if(targetUserData.ProfilePicture != null)
    {
      this.setState({
        'username': targetUserData.Username, 
        'userFollowers': targetUserData.Followers, 
        'userID': targetUserData.id,
        'ProfilePicture': targetUserData.ProfilePicture 
      })
    }
    else
    {
      this.setState({
        'username': targetUserData.Username, 'userFollowers': targetUserData.Followers, 'userID': targetUserData.id
      })
    }
  }
  render() {
    return (
     <div className='sidebarWrapper'>
        <div className = 'ProfileDataWrapper'>
        {this.state.ProfilePicture.data
                      ?
                        <img 
                            src={
                              `data: image/png;base64,
                              ${Buffer.from(this.state.ProfilePicture.data).toString('base64')}`
                              }
                            className='userPFP'
                        />
                      :
                        <img 
                          src={`${this.state.ProfilePicture}`}
                          className='userPFP'
                        />
          }
          <br></br>
          <a href={`Profile/${this.state.userID}`}> <h2 className='username'>{this.state.username}</h2></a>
          <h3 className='followers'> {this.state.userFollowers} Followers </h3>
        </div>
        <div className='safeMenu menu'>
          <h2 className='upcomingEvents menuItem'>Upcoming events</h2>
          <h2 className='attendedEvents menuItem'>Attended events</h2>
          <h2 className='hostedEvents menuItem'>Hosted events</h2>

        </div>
        <div className='dangerousMenu menu fixed-bottom'>
            <h2 className='settings menuItem'> <FontAwesomeIcon icon={faCog}/> Settings</h2>
            <h2 className='logout menuItem' onClick = {() => this.logOut()}> <FontAwesomeIcon icon={faSignOut}/> Log out</h2>
        </div>
     </div>
    )
  }
}
