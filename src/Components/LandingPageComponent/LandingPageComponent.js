import React, { Component } from 'react'
import NavbarComponentRegisteredUser from '../NavbarComponent/NavbarComponentRegisteredUser'
import NavbarComponentNotRegisteredUser from '../NavbarComponent/NavbarComponentNotRegisteredUser'

export default class LandingPageComponent extends Component {
  render() {
    return (
      <div>
        <NavbarComponentNotRegisteredUser/>
      </div>
    )
  }
}
