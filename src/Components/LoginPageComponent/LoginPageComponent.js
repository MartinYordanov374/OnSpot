import React, { Component } from 'react'
import NavbarComponentNotRegisteredUser from '../NavbarComponent/NavbarComponentNotRegisteredUser'
import { Container, InputGroup, Form, Button } from 'react-bootstrap'
import '../LoginPageComponent/LoginPageStyles/LoginPageStyles.css'
export default class LoginPageComponent extends Component {
  render() {
    return (
      <Container>
        <NavbarComponentNotRegisteredUser/>
        <div className='LoginFormWrapper'>
            <Form.Control placeholder='Email'/>      
            <Form.Control placeholder='Password' type='password'/>    
            <Button> Log In </Button>

        </div>
      </Container>
    )
  }
}
