import React, { Component } from 'react'
import {Navbar, NavItem, NavLink, Nav, NavbarBrand, Container} from 'react-bootstrap'
import {} from '@fortawesome/fontawesome-svg-core'
import 'bootstrap/dist/css/bootstrap.css';
import './NavbarStyles.css'
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export default class NavbarComponentRegisteredUser extends Component {
  render() {
    return (
      
      <Navbar>
      <Container>
        <NavbarBrand href="/">
          <FontAwesomeIcon icon={faLocationDot}/> OnSpot
        </NavbarBrand>
        <Nav className="mr-auto"> 
          <Nav.Link href="/ExploreEvents">Explore events</Nav.Link>
          <Nav.Link className= 'hostEventLink' href="/HostEvent">Host an Event</Nav.Link>

          <Nav.Link href="/profile">
            <img 
            src='https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.pinimg.com%2F736x%2F8b%2F16%2F7a%2F8b167af653c2399dd93b952a48740620.jpg&f=1&nofb=1&ipt=33608bf0973b950d8a9032fd47b796c156c60bf3f6edf4b174dc2947f2d9b4da&ipo=images'
            className='ProfilePicture'
          />
          </Nav.Link>

        </Nav>
      </Container>
    </Navbar>
    )
  }
}
