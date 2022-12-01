import React, { Component } from 'react'
import './SidebarStyling/SidebarStyle.css'
import { faCog, faSignOut } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Axios from 'axios'

export default class SidebarComponent extends Component {
  async logOut(){
    let result = await Axios.get('http://localhost:3030/logout', {withCredentials: true})
    window.location.href = '/'
  }
  render() {
    return (
     <div className='sidebarWrapper'>
        <div className = 'ProfileDataWrapper'>
          <img className='userPFP' src='https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.pinimg.com%2F736x%2F8b%2F16%2F7a%2F8b167af653c2399dd93b952a48740620.jpg&f=1&nofb=1&ipt=33608bf0973b950d8a9032fd47b796c156c60bf3f6edf4b174dc2947f2d9b4da&ipo=images'/>
          <br></br>
          <h2 className='username'>Martin Yordanov</h2>
          <h3 className='followers'> 0 Followers </h3>
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
