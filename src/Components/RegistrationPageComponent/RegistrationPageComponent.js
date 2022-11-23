import React, { Component } from 'react'
import NavbarComponentNotRegisteredUser from '../NavbarComponent/NavbarComponentNotRegisteredUser'
import { Container } from 'react-bootstrap'

export default class RegistrationPageComponent extends Component {
  render() {
    return (
        <Container>
            <NavbarComponentNotRegisteredUser/>
        </Container>
    )
  }
}
