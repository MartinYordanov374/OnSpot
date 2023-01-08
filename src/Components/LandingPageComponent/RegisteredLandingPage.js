import React, { Component } from 'react'
import EventCardComponent from '../EventCardComponent/EventCardComponent';
import SidebarComponent from '../SidebarComponent/SidebarComponent';
import NavbarComponentRegisteredUser from '../NavbarComponent/NavbarComponentRegisteredUser'
import { Container } from 'react-bootstrap'
import Axios from 'axios'
import SquareEventCardComponent from '../SquareEventCardComponent/SquareEventCardComponent';

export default class RegisteredLandingPage extends Component {
    constructor()
    {
      super()
      this.state = {events: []}
    }

    componentDidMount()
    {
      this.getEvents()
    }
    getEvents = async () => {
      let events = await Axios.get('http://localhost:3030/getAllEvents', {withCredentials: true})
      .then((res) => {this.setState({'events': res.data.payload})})
      .catch((err) => {console.log(err)})
    }
  render() {
    return (
        <div>

              <SidebarComponent/>
                {/* <NavbarComponentRegisteredUser/> */}
                <Container className='EventCardsContainer'>
                  <div className='EventCardsWrapper row' style={{'margin-left': '2%'}}>
                    {this.state.events.map((event) => {
                      return <SquareEventCardComponent props={event}/>
                      })}
                  </div>
                </Container>
        </div>
    )
  }
}
