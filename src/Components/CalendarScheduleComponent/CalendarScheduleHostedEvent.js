import React, { Component } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from "moment";
import NavbarComponentRegisteredUser from '../NavbarComponent/NavbarComponentRegisteredUser'
import SidebarComponent from '../SidebarComponent/SidebarComponent';
import { Container } from 'react-bootstrap'
import Axios from 'axios'

import './Styles/CalendarScheduleStyle.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import NonRegisteredLandingPage from '../LandingPageComponent/NonRegisteredLandingPage';

export default class CalendarScheduleHostedEvents extends Component {
  constructor()
  {
    super()    
    this.localizer = momentLocalizer(moment)
    this.state = 
      { 
        hostedEvents: [],
        currentUserData: [],
        isLoading: true,
        loginStatus: false
        }
  }
  componentDidMount = async() => {
    try{
      this.checkIfUserIsLoggedIn()
      await Axios.get('http://localhost:3030/getUserData', {withCredentials: true})
      .then(async (res) => {
        this.setState({'currentUserData': res.data[0]}, async () =>{
            await Axios.get(`http://localhost:3030/GetAllEventsHostedByUser/${this.state.currentUserData.id}`, {withCredentials: true})
              .then((res) => {
                let eventsList = []
                res.data.map((event) => {
                  console.log(event)
                  eventsList.push({'title': event.EventName, 'start': new Date(event.EventStartDate), 'end': new Date (event.EventEndDate)})
                })
                this.setState({'hostedEvents': eventsList})
              })
            })
        
        this.setState({'isLoading': false})
      })
    }
    catch(err)
    {
      console.log(err)
    }
  }

  checkIfUserIsLoggedIn = async () => {
    await Axios.get('http://localhost:3030/isUserLoggedIn', {withCredentials: true})
    .then((res)=>{
      if(res.data == true)
      {
        
          this.setState({'loginStatus': true})
      }
      else
      {
        this.setState({'loginStatus': false})
      }})
  }
  render() {
    return (
      <div>
        {this.state.loginStatus == true ?
        <div className='CalendarWrapper justify-content-center align-items-center'>
          <SidebarComponent/> 
          {this.state.isLoading == true ? 
              "Loading"
          : 
          <Container className='CalendarContainer'>
          {/* <NavbarComponentRegisteredUser/> */}
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
        :
        <NonRegisteredLandingPage/>}
      </div>
    )
  }
}

