import React, { Component } from 'react'
import { Container, FormControl } from 'react-bootstrap'
import NonRegisteredLandingPage from '../LandingPageComponent/NonRegisteredLandingPage'
import NavbarComponentRegisteredUser from '../NavbarComponent/NavbarComponentRegisteredUser'
import SidebarComponent from '../SidebarComponent/SidebarComponent'
import './ExploreEventsStyles/ExploreEventsStyle.css'
import Axios from 'axios'

export default class ExploreEventsComponent extends Component {
  constructor()
  {
    super()
    this.state = {userData: [], isLoading: true, loginStatus: false}
  }
  componentDidMount = () =>
  {
    this.checkIfUserIsLoggedIn()
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
        <div>
          <SidebarComponent/>
          <Container>
            {/* <NavbarComponentRegisteredUser/> */}
            <div className='searchPageWrapper'>
              <div className='searchBarWrapper d-flex justify-content-center'>
                <FormControl className='searchBar d-flex' placeholder='Search events'/>
              </div>
              <div className='searchResults d-flex justify-content-center'>
                <h6>Your search results will be shown below</h6>
              </div>
            </div>

          </Container>
        </div>
      : 
      <NonRegisteredLandingPage/>}
      </div>

    )
  }
}
