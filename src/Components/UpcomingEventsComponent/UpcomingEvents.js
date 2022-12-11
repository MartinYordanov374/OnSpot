import React, { Component } from 'react'
import NonRegisteredLandingPage from '../LandingPageComponent/NonRegisteredLandingPage'
import Axios from 'axios'
import UpcomingEventsCalendar from './UpcomingEventsCalendar'
import NavbarComponentRegisteredUser from '../NavbarComponent/NavbarComponentRegisteredUser'

export default class UpcomingEvents extends Component {
    constructor()
    {
      super()
      this.state = {loginStatus: false}
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
    componentDidMount()
    {
      this.checkIfUserIsLoggedIn()
    }
  render() {
    return (
      <div>
         {this.state.loginStatus == true ?
        <div>
            <NavbarComponentRegisteredUser/>
            <UpcomingEventsCalendar/>
        </div>
        :
        <div>
            <NonRegisteredLandingPage/>
        </div>
        }
      </div>
    )
  }
}
