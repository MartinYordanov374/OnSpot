import React, { Component } from 'react'
import { getFirstDayOfMonth } from './utils'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from "moment";
import 'react-big-calendar/lib/css/react-big-calendar.css';
export default class CalendarSchedule extends Component {
  constructor()
  {
    super()
    this.firstDayOfMonth = getFirstDayOfMonth( new Date().getUTCFullYear(), new Date().getMonth()).toString().split(' ')[0]    
    
    this.localizer = momentLocalizer(moment)
    this.state = 
      { events: [{
        start: moment().toDate(),
        end: moment()
          .add(1, "days")
          .toDate(),
        title: "Покланяне на слънцето"
      }]
      }
  
  
  }
  render() {
    return (
      <div className='CalendarWrapper'>
        <Calendar
          localizer={this.localizer}
          events={this.state.events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
        />
      </div>
    )
  }
}

