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
      this.state = {events: [], initialEventElementID: 0}
    }

    async componentDidMount()
    {
      await this.getEvents()
      window.addEventListener('scroll', this.checkIfUserScrolledToBottom());
    }
    componentWillUnmount()
    {
      window.removeEventListener('scroll', this.checkIfUserScrolledToBottom())
    }
    getEvents = async () => {
      let events = await Axios.get('http://localhost:3030/getAllEvents', {withCredentials: true})
      .then((res) => {this.setState({'events': res.data.payload})})
      .catch((err) => {console.log(err)})
    }

    checkIfUserScrolledToBottom = async () =>{

      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
         console.log("you're at the bottom of the page");
         // Show loading spinner and make fetch request to api
        let result = await Axios.get('http://localhost:3030/getNextTwoEvents/2', {withCredentials: true})
        console.log(result)
      }
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
