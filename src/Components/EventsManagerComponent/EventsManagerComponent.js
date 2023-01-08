import React, { Component } from 'react'
import NonRegisteredLandingPage from '../LandingPageComponent/NonRegisteredLandingPage'
import Axios from 'axios'

import NavbarComponentRegisteredUser from '../NavbarComponent/NavbarComponentRegisteredUser'
import UpcomingEventsComponent from './UpcomingEventsComponent'

export default class EventsManagerComponent extends Component {
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
            {/* <NavbarComponentRegisteredUser/> */}
            <UpcomingEventsComponent/>
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
