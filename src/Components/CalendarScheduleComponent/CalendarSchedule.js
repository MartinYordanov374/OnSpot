import React, { Component } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from "moment";
import 'react-big-calendar/lib/css/react-big-calendar.css'
export default class CalendarSchedule extends Component {
  constructor()
  {
    super()    
    this.localizer = momentLocalizer(moment)
    this.state = 
      { events: [{
        start: moment().toDate(),
        end: moment()
          .add(1, "days")
          .toDate(),
        title: "Покланяне на слънцето"
      },
    ]
      }
  
  
  }
  render() {
    return (
      <div className='CalendarWrapper'>
        <Calendar className='c1'
          localizer={this.localizer}
          defaultView = 'month'
          views={['month', 'week', 'day']}
          events={this.state.events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500, backgroundColor: 'white' }}
          eventPropGetter={() => ({
            style: { backgroundColor: "#72B2E4", fontWeight: 'bold' }
          })}
        />
      </div>
    )
  }
}

