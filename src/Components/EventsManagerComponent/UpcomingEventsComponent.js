import Axios from 'axios'
import React, { Component } from 'react'
import EventCardComponent from '../EventCardComponent/EventCardComponent'
import './Styles/UpcomingEventsStyles.css'
export default class UpcomingEventsComponent extends Component {
    constructor()
    {
        super()
        this.state = {currentDate: '', UpcomingEvents: [], AttendedEvents: [], HostedEvents: [], userID: -10, isLoading: true}
    }
    componentDidMount = async() =>
    {
      await Axios.get('http://localhost:3030/getUserData', {withCredentials: true})
      .then((res) => {
        this.setState({'userID': res.data[0].id})
        this.GetAllUserHostedEvents()
        this.GetAllUpcomingUserEvents()
        this.GetAllAttendedUserEvents()
      })
    }
    GetAllUserHostedEvents = async() =>
    {
      let result = await Axios.get(`http://localhost:3030/GetAllEventsHostedByUser/${this.state.userID}`, {withCredentials: true})
      .then((res) => this.setState({'HostedEvents':res.data}))
    }
    GetAllUpcomingUserEvents = async() =>
    {
      let result = await Axios.get(`http://localhost:3030/GetAllUpcomingUserEvents/${this.state.userID}`, {withCredentials: true})
      .then((res) => this.setState({'UpcomingEvents':res.data}))
      
    }
    GetAllAttendedUserEvents = async() =>
    {
      let result = await Axios.get(`http://localhost:3030/GetAllAttendedUserEvents/${this.state.userID}`, {withCredentials: true})
      .then((res) => {
        this.setState({'AttendedEvents':res.data})
        this.setState({'isLoading': false})
      })
    }
  render() {
    // TODO: ADD LOADING SCREEN
    return (
      <div>
        {this.state.isLoading == false ? 
            <div className='EventsWrapper row'>
                <div className='HostedEventsCard eventsCard col'>
                  {this.state.HostedEvents.map((hostedEvent) => {
                    return(
                        <EventCardComponent props = {hostedEvent} />
                    )
                  })}

                </div>
                <div className='AttendedEventsCard eventsCard col'>
                {this.state.AttendedEvents.map((attendedEvent) => {
                  <EventCardComponent props = {attendedEvent}/>
                })}

                </div>
                <div className='UpcomingEventsCard eventsCard col'>
                    <EventCardComponent props = {{username: 'test', EventType: 1, EventClass: 'class', EventName: 'UpcomingEvent', EventDescription: 'UpcomingEvent', EventID: 1, ProfilePicture: ''}} />
                </div>
            </div>
        : <span>Loading</span>
        }
      </div>
    )
  }
}
