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
        this.setState({'isLoading': false})

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
      })
    }
    render() {
      // TODO: ADD LOADING SCREEN
    return (
      <div>
        {this.state.isLoading == false ? 
            <div className='EventsWrapper row'>
                <div className='HostedEventsCard eventsCard col'>
                  {
                    this.state.HostedEvents.length >= 1 ?
                    this.state.HostedEvents.map((hostedEvent) => {
                      return(
                          <EventCardComponent props = {hostedEvent} />
                      )
                    })
                    :
                    "You have not hosted any events."

                  }

                </div>
                <div className='AttendedEventsCard eventsCard col'>
                  {
                    this.state.AttendedEvents.length >= 1 ?
                  
                    this.state.AttendedEvents.map((attendedEvent) => {
                      return(
                        <EventCardComponent props = {attendedEvent}/>
                      )
                    })
                    :
                    "You have not attended any events."
              }

                </div>
                <div className='UpcomingEventsCard eventsCard col'>
                {this.state.UpcomingEvents.length >= 1 ?
                  this.state.UpcomingEvents.map((upcomingEvent) => {
                    return(
                      <EventCardComponent props = {upcomingEvent}/>
                    )
                  })
                  :
                  "You do not have any upcoming events."
                }
                </div>
            </div>
        : <span>Loading</span>
        }
      </div>
    )
  }
}
