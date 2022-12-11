import Axios from 'axios'
import React, { Component } from 'react'
import EventCardComponent from '../EventCardComponent/EventCardComponent'
import './Styles/UpcomingEventsStyles.css'
export default class UpcomingEventsComponent extends Component {
    constructor()
    {
        super()
        this.state = {currentDate: '', UpcomingEvents: [], AttendedEvents: [], HostedEvents: [], userID: ''}
    }
    componentDidMount = async() =>
    {
      let result = await Axios.get('http://localhost:3030/getUserData', {withCredentials: true})
      this.setState({'userID': result.data[0].id})
      this.GetAllUpcomingUserEvents()
      this.GetAllAttendedUserEvents()
      this.GetAllUserHostedEvents()
    }
    GetAllUserHostedEvents = async() =>
    {
      let result = await Axios.get(`http://localhost:3030/GetAllEventsHostedByUser/${this.state.userID}`, {withCredentials: true})
      this.setState({'HostedEvents':result.data})
    }
    GetAllUpcomingUserEvents = async() =>
    {
      let result = await Axios.get(`http://localhost:3030/GetAllUpcomingUserEvents/${this.state.userID}`, {withCredentials: true})
      this.setState({'UpcomingEvents':result.data})
    }
    GetAllAttendedUserEvents = async() =>
    {
      let result = await Axios.get(`http://localhost:3030/GetAllAttendedUserEvents/${this.state.userID}`, {withCredentials: true})
      this.setState({'AttendedEvents':result.data})
    }
  render() {
    // TODO: ADD LOADING SCREEN
    return (
      <div>
            <div className='EventsWrapper row'>
                <div className='HostedEventsCard eventsCard col'>
                  <EventCardComponent props = {{username: 'test', EventType: 1, EventClass: 'class', EventName: 'HostedEvent', EventDescription: 'HostedEvent', EventID: 1, ProfilePicture: ''}} />

                </div>
                <div className='AttendedEventsCard eventsCard col'>
                  <EventCardComponent props = {{username: 'test', EventType: 1, EventClass: 'class', EventName: 'AttendedEvent', EventDescription: 'AttendedEvent', EventID: 1, ProfilePicture: ''}} />

                </div>
                <div className='UpcomingEventsCard eventsCard col'>
                    <EventCardComponent props = {{username: 'test', EventType: 1, EventClass: 'class', EventName: 'UpcomingEvent', EventDescription: 'UpcomingEvent', EventID: 1, ProfilePicture: ''}} />
                </div>
            </div>
      </div>
    )
  }
}
