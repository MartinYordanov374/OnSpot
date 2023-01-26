import React, { Component } from 'react'
import './LandingPageStyles/LandingPage.css'
import Axios from 'axios'
import NonRegisteredLandingPage from './NonRegisteredLandingPage';
import RegisteredLandingPage from './RegisteredLandingPage'

export default class LandingPageComponent extends Component {
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
    // TODO: ADD CUSTOM LOADING PAGE UNTIL PAGE IS READY
    return (
      <div>
        {this.state.loginStatus == false ?
        <div>
            <NonRegisteredLandingPage/>
        </div>
        :
        <div>
            <RegisteredLandingPage/>
        </div>
        }
      </div>
    )
  }
}
