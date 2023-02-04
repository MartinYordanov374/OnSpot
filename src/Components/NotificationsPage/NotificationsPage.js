import React, { Component } from 'react';
import { Container, Row, Col, ListGroup, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquare, faCheckSquare, faEye } from '@fortawesome/free-solid-svg-icons';
import './Style/NotificationsPage.css'
import SidebarComponent from '../SidebarComponent/SidebarComponent';
import Axios from 'axios'



class NotificationFilters extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFilter: this.props.selectedFilter,
      Notifications: []
    };
  }

  
  
  
  render() {
    return (
      <div>
        <div>
          <div id="notification-filters">
            <button 
              className={`notification-filter ${this.props.selectedFilter === 'unread' ? 'selected' : ''}`} 
              onClick={() => this.props.handleClick('unread')}
            >
              <FontAwesomeIcon icon={this.props.selectedFilter === 'unread' ? faCheckSquare : faSquare} />
              Unread
            </button>
            <button 
              className={`notification-filter ${this.props.selectedFilter === 'read' ? 'selected' : ''}`} 
              onClick={() => this.props.handleClick('read')}
            >
              <FontAwesomeIcon icon={this.props.selectedFilter === 'read' ? faCheckSquare : faSquare} />
              Read
            </button>
            <button 
              className={`notification-filter ${this.props.selectedFilter === 'all' ? 'selected' : ''}`} 
              onClick={() => this.props.handleClick('all')}
            >
              <FontAwesomeIcon icon={this.props.selectedFilter === 'all' ? faCheckSquare : faSquare} />
              All
            </button>
          </div>
        </div>
          
      </div>
    );
  }
};

export default class NotificationsPage extends Component {

  constructor()
  {
    super()
    this.state = {
      Notifications: [],
      shownNotifications: [],
      selectedFilter: 'unread'

    };
  }

  componentDidMount()
  {
    this.getUserNotifications()
  }

  getUserNotifications()
  {
    Axios.get('http://localhost:3030/GetUserNotifications', {withCredentials: true})
    .then((res) => {
      let notifications = res.data.data.data
      if(notifications)
      {
        this.setState({'Notifications': notifications})
        this.setState({'shownNotifications': notifications})
      }
    })
    .catch((err) => {
      console.log(err)
    })
  }

  handleClick = (filter) => {
    this.setState({'selectedFilter': filter}, () => {
      if(this.state.selectedFilter == 'read')
      {
        let readNotifications = this.state.Notifications.filter((notification) => notification.IsNotificationRead == 0) 
        this.setState({'shownNotifications': readNotifications}) 

      }
      else if(this.state.selectedFilter == 'unread')
      {
        let unreadNotifications = this.state.Notifications.filter((notification) => notification.IsNotificationRead == 1) 
        this.setState({'shownNotifications': unreadNotifications}) 

      }
      else{
        let allNotifications = this.state.Notifications
        this.setState({'shownNotifications': allNotifications}) 

      }
    });
  }

  MarkAsRead(notificationID)
  {
    console.log(`marked ${notificationID} as Read`)
  }

  render() {
    return (
      <div>
      <SidebarComponent/>
      <Container>
        <Row className="justify-content-center">
          <Col lg={10}>
            <h2 className="text-center">Notifications</h2>
            <NotificationFilters selectedFilter={this.state.selectedFilter} handleClick = {this.handleClick}/>
            <ListGroup>
            {this.state.shownNotifications.map((notification) => {
              return(
                <ListGroup.Item className="notification" key = {notification.NotificationID}>
                    <p className="date">{new Date(notification.NotificationDate).toLocaleString()}</p>
                    <p className="message">{notification.Username + ' ' + notification.NotificationMessage}</p>
                    <p className="status">{notification.IsNotificationRead == 1 ? 'Unread' : 'Read'}</p>
                    { notification.IsNotificationRead == 1 ?
                    <FontAwesomeIcon title="Mark as read" icon={faEye} className="check-mark empty"  onClick={() => this.MarkAsRead(notification.NotificationID)}/>
                    :
                    <FontAwesomeIcon icon={faCheckSquare} className="check-mark" />
                    }
                  </ListGroup.Item>
              )

            })}
            </ListGroup>
          </Col>
        </Row>
      </Container>
      </div>
    )
  }
}