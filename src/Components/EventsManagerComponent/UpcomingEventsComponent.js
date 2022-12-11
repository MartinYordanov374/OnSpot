import React, { Component } from 'react'
import EventCardComponent from '../EventCardComponent/EventCardComponent'
import './Styles/UpcomingEventsStyles.css'
export default class UpcomingEventsComponent extends Component {
    constructor()
    {
        super()
        this.state = {currentDate: '', UpcomingEvents: [], AttendedEvents: [], HostedEvents: []}
    }
  render() {
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
