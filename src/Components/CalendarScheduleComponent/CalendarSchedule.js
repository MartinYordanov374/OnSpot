import React, { Component } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from "moment";
import NavbarComponentRegisteredUser from '../NavbarComponent/NavbarComponentRegisteredUser'
import SidebarComponent from '../SidebarComponent/SidebarComponent';
import { Container } from 'react-bootstrap'

import './Styles/CalendarScheduleStyle.css'
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
      <div className='CalendarWrapper justify-content-center align-items-center'>
        <SidebarComponent/> 
        <Container className='CalendarContainer'>
          <NavbarComponentRegisteredUser/>
            <Calendar
              localizer={this.localizer}
              defaultView = 'month'
              views={['month', 'week', 'day']}
              events={this.state.events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 800, backgroundColor: 'white' }}
              eventPropGetter={() => ({
                style: { backgroundColor: "#72B2E4", fontWeight: 'bold' }
              })}/>

        </Container>
      </div>
    )
  }
}

