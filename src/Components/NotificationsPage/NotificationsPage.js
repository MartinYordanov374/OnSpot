import React, { Component } from 'react';
import { Container, Row, Col, ListGroup, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquare, faCheckSquare } from '@fortawesome/free-solid-svg-icons';
import './Style/NotificationsPage.css'
import SidebarComponent from '../SidebarComponent/SidebarComponent';
import Axios from 'axios'



class NotificationFilters extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFilter: 'unread',
      Notifications: []
    };
  }

  handleClick = (filter) => {
    this.setState({
      selectedFilter: filter
    });
  }


  render() {
    const { selectedFilter } = this.state;

    return (
      <div>
        <div>
          <div id="notification-filters">
            <button 
              className={`notification-filter ${this.state.selectedFilter === 'unread' ? 'selected' : ''}`} 
              onClick={() => this.handleClick('unread')}
            >
              <FontAwesomeIcon icon={this.state.selectedFilter === 'unread' ? faCheckSquare : faSquare} />
              Unread
            </button>
            <button 
              className={`notification-filter ${this.state.selectedFilter === 'read' ? 'selected' : ''}`} 
              onClick={() => this.handleClick('read')}
            >
              <FontAwesomeIcon icon={this.state.selectedFilter === 'read' ? faCheckSquare : faSquare} />
              Read
            </button>
            <button 
              className={`notification-filter ${this.state.selectedFilter === 'all' ? 'selected' : ''}`} 
              onClick={() => this.handleClick('all')}
            >
              <FontAwesomeIcon icon={this.state.selectedFilter === 'all' ? faCheckSquare : faSquare} />
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
      Notifications: []
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
      }
    })
    .catch((err) => {
      console.log(err)
    })
  }
  render() {
    return (
      <div>
      <SidebarComponent/>
      <Container>
        <Row className="justify-content-center">
          <Col lg={10}>
            <h2 className="text-center">Notifications</h2>
            <NotificationFilters />
            <ListGroup>
            {this.state.Notifications.map((notification) => {
              console.log(notification)
              return(
                <ListGroup.Item className="notification">
                  <p className="date">{new Date(notification.NotificationDate).toLocaleString()}</p>
                  <p className="message">{notification.Username + ' ' + notification.NotificationMessage}</p>
                  <p className="status">{notification.IsNotificationRead == 1 ? 'Unread' : 'Read'}</p>
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