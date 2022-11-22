import React, { Component } from 'react'
import {Navbar, NavItem, NavLink, Nav, NavbarBrand, Container} from 'react-bootstrap'
import {} from '@fortawesome/fontawesome-svg-core'
import 'bootstrap/dist/css/bootstrap.css';
import './NavbarStyles.css'
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export default class NavbarComponentNotRegisteredUser extends Component {
  render() {
    return (
      
      <Navbar>
      <Container>
        <NavbarBrand href="/">
          <FontAwesomeIcon icon={faLocationDot}/> OnSpot
        </NavbarBrand>
        
      </Container>
    </Navbar>
    )
  }
}
