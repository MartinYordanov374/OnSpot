import React, { Component } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from "moment";
import NavbarComponentRegisteredUser from '../NavbarComponent/NavbarComponentRegisteredUser'
import SidebarComponent from '../SidebarComponent/SidebarComponent';
import { Container } from 'react-bootstrap'
import Axios from 'axios'

import './Styles/CalendarScheduleStyle.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'

export default class CalendarSchedule extends Component {
  constructor()
  {
    super()    
    this.localizer = momentLocalizer(moment)
    this.state = 
      { upcomingEvents: [],
        attendedEvents: [],
        hostedEvents: [],
        currentUserData: [],
        isLoading: true
    }
  }
  componentDidMount = async() => {
    try{
      
      await Axios.get('http://localhost:3030/getUserData', {withCredentials: true})
      .then(async (res) => {
        this.setState({'currentUserData': res.data[0]})
        
        await Axios.get(`http://localhost:3030/GetAllUpcomingUserEvents/${this.state.currentUserData.id}`, {withCredentials: true})
        .then((res) => {
          this.setState({'upcomingEvents': res.data})
        })

        await Axios.get(`http://localhost:3030/GetAllAttendedUserEvents/${this.state.currentUserData.id}`, {withCredentials: true})
        .then((res) => {
          this.setState({'attendedEvents': res.data})
        })

        await Axios.get(`http://localhost:3030/GetAllEventsHostedByUser/${this.state.currentUserData.id}`, {withCredentials: true})
        .then((res) => {
          this.setState({'hostedEvents': res.data})
        })
        
        this.setState({'isLoading': false})
      })
    }
    catch(err)
    {
      console.log(err)
    }
  }

  getCurrentUserData = async() => {
    try{
      let res = await Axios.get('http://localhost:3030/getUserData', {withCredentials: true})
    }
    catch(err)
    {
      console.log(err)
    }

  }
  render() {
    console.log(this.state)
    return (
      <div className='CalendarWrapper justify-content-center align-items-center'>
        <SidebarComponent/> 
        {this.state.isLoading == true ? 
            "Loading"
         : 
         <Container className='CalendarContainer'>
         <NavbarComponentRegisteredUser/>
           <Calendar
             localizer={this.localizer}
             defaultView = 'month'
             views={['month', 'week', 'day']}
             events={this.state.hostedEvents}
             startAccessor="start"
             endAccessor="end"
             style={{ height: 800, backgroundColor: 'white' }}
             eventPropGetter={() => ({
               style: { backgroundColor: "#72B2E4", fontWeight: 'bold' }
             })}/>

       </Container>}

      </div>
    )
  }
}

