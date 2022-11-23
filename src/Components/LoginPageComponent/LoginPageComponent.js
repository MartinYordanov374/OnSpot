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
            <h1 className='logInText'>Log In</h1>
            <Form.Control className='EmailField field' placeholder='Email'/>      
            <Form.Control className='PasswordField field' placeholder='Password' type='password'/>   
            <div className='logInButtonWrapper'>
                <Button className='LogInButton'> Log In </Button>
            </div> 
        </div>
        <div className='NotRegisteredYetWrapper text-center fixed-bottom'>
                <p className='NotRegisteredYet'>You don't have an account yet? <a href='/register' className='registerLink'>Register here.</a></p>
        </div>
      </Container>
    )
  }
}
