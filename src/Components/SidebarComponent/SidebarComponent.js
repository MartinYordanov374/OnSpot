import React, { Component } from 'react'
import './SidebarStyling/SidebarStyle.css'
import { faCog, faSignOut, faCalendarCheck, faCalendar, faCalendarDays, faSearch, faBell, faPlusCircle, faLocationDot, faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Buffer } from 'buffer';
import Axios from 'axios'
import * as io from 'socket.io-client'

export default class SidebarComponent extends Component {
  constructor()
  {
    super()
    this.state = {username: '', userFollowers: 0, userID: 0, 
    ProfilePicture: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.pinimg.com%2F736x%2F8b%2F16%2F7a%2F8b167af653c2399dd93b952a48740620.jpg&f=1&nofb=1&ipt=33608bf0973b950d8a9032fd47b796c156c60bf3f6edf4b174dc2947f2d9b4da&ipo=images',
    socket: io.connect('http://localhost:3030/'),
    unreadNotifications: 0,
    Notifications: []}
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

    this.getUserNotifications()

  }

  componentDidUpdate()
  {
    this.state.socket.on('receiveMessageNotification', async (res) => {
      let senderID = res.senderID
      let receiverID = Number(res.receiverID)
      let notificationType = res.notificationType

      if(notificationType == 'msg')
      {
        if(Number(this.state.userID) == receiverID)
        {
          // TODO: Make the message notifications count as one notification, if coming from one user
          // two notifications if coming from 2 users etc.
          // TODO: CHANGE THE USER ID IN THE NOTIFICATION CONTENT WITH THE USERNAME OF THE GIVEN USER.
          this.setState({'unreadNotifications': this.state.unreadNotifications+1})
          
        }

        
        await Axios.post('http://localhost:3030/SaveNotifications', {
            SenderID: senderID,
            ReceiverID: receiverID,
            NotificationContent: `sent you a message!`,
            NotificationDate: new Date(),
            NotificationType: notificationType,

          }, 
          {
            withCredentials: true
          })
          .then((res) => {
            console.log(res)
          })
          .catch((err) => {
            console.log(err)
          })
      }

      this.getUserNotifications()
    })

    this.state.socket.on('receivePostNotification', async(res) => {
      let posterID = res.senderID
      let notificationType = res.notificationType
      let userFollowers = []

      Axios.get(`http://localhost:3030/getUserFollowers/${posterID}`, {withCredentials: true})
      .then((res) => {
        userFollowers = res.data
      })

      if(notificationType == 'post')
      {
        userFollowers.map((userFollower) => {
          console.log(userFollower)
          if(userFollower.FollowerUserID == this.state.userID)
          {
            this.setState({'unreadNotifications': this.state.unreadNotifications+1})
          }
        })
      }

      this.getUserNotifications()


    })
  }

  async getUserNotifications()
  {
    Axios.get('http://localhost:3030/GetUserNotifications', {withCredentials: true})
    .then((res) => {
      let notifications = res.data.data.data
      if(notifications)
      {
        let unreadNotifications = notifications.filter((notification) => notification.IsNotificationRead == 1) 
        this.setState({'Notifications': unreadNotifications})
      }
    })
    .catch((err) => {
      console.log(err)
    })
  }

  render() {
    return (
     <div className='sidebarWrapper  position-fixed'>

        <div className='HeaderWrapper menu'>
          <a href={`/`} className='homeLink'> 
            <h2 className='menuItemName'> <FontAwesomeIcon icon={faLocationDot}/> OnSpot </h2>
          </a>
        </div>

        <div className = 'ProfileDataWrapper'>
        <a href={`Profile/${this.state.userID}`}>
          <div className=' profileDataContainer d-flex'>
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
                <h2 className='username menuItemName'>{this.state.username}</h2>
          </div>
          </a>

          {/* <h3 className='followers'> {this.state.userFollowers} Followers </h3> */}
        </div>
        <div className='safeMenu menu'>
        <h2 className='upcomingEvents menuItem'> 
            <a href='/'>
              <FontAwesomeIcon icon={faHome}/> 
              <span className='menuItemName'> Home </span>
            </a>
          </h2>
          <h2 className='upcomingEvents menuItem'> 
            <a href='/EventsManager/CalendarSchedule/UpcomingEvents'>
              <FontAwesomeIcon icon={faCalendarDays}/> 
              <span className='menuItemName'> Upcoming events </span>
            </a>
          </h2>
          <h2 className='attendedEvents menuItem'>
            <a href='/EventsManager/CalendarSchedule/AttendedEvents'>
            <FontAwesomeIcon icon={faCalendarCheck}/> 
            <span className='menuItemName'> Attended events </span>
            
            </a>
          </h2>
          <h2 className='hostedEvents menuItem'>
            <a href='/EventsManager/CalendarSchedule/HostedEvents'>
              <FontAwesomeIcon icon={faCalendar}/> 
              <span className='menuItemName'> Hosted events </span>
              
            </a>
          </h2>
          <h2 className='exploreEvents menuItem'>
            <a href='/ExploreEvents'>
              <FontAwesomeIcon icon={faSearch}/> 
              <span className='menuItemName'> Explore events </span>
              
            </a>
          </h2>
          <h2 className='exploreEvents menuItem'>
            <a href='/HostEvent'>
              <FontAwesomeIcon icon={faPlusCircle}/> 
              <span className='menuItemName'> Host an event </span>
            </a>
          </h2>
          <h2 className='exploreEvents menuItem'>
            <a href='/Notifications'>
              <div style={{position: "relative"}}>
                <FontAwesomeIcon icon={faBell} />
                <span className={this.state.unreadNotifications + this.state.Notifications.length > 0 ? 'notificationsCircle': 'hiddenNotificatiosCircle'}>
                  {
                    this.state.unreadNotifications + this.state.Notifications.length > 0 ? 
                    this.state.unreadNotifications + this.state.Notifications.length : 
                    ""
                  }
                </span>
              <span className='menuItemName'> Notifications </span>
              </div>
            </a>
          </h2>

          <h2 className='exploreEvents menuItem'>
            <a href='/Settings'>
              <FontAwesomeIcon icon={faCog}/> 
              <span className='menuItemName'> Settings </span>
            </a>
          </h2>
          <h2 className='exploreEvents menuItem' onClick = {() => this.logOut()  }>
            <a >
              <FontAwesomeIcon icon={faSignOut}/> 
              <span className='menuItemName'> Log out </span>
            </a>
          </h2>
        </div>
     </div>
    )
  }
}
