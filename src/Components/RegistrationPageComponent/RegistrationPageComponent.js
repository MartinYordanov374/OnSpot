import React, { Component } from 'react'
import NavbarComponentNotRegisteredUser from '../NavbarComponent/NavbarComponentNotRegisteredUser'
import { Container, InputGroup, Form, Button } from 'react-bootstrap'
import '../RegistrationPageComponent/RegistrationPageStyles/RegistrationPageStyles.css'
export default class RegistrationPageComponent extends Component {
  render() {
    return (
        <Container>
            <NavbarComponentNotRegisteredUser/>
            <div className='SignUpComponentWrapper ' >
                <h1 className='signUpText'>Sign Up</h1>
                <div className='registrationFormWrapper'>
                    <InputGroup className='emailUsernameForms mb-5' >
                        <Form.Control className='emailField field left' placeholder='Email'/>
                        <Form.Control className='usernameField field right' placeholder='Preferred username'/>
                    </InputGroup>
                    <InputGroup className = 'passwordForms'>
                        <Form.Control className = 'passwordField field left'  type='password' placeholder='Password'/>
                        <Form.Control className = 'confirmPasswordField field left' type='password' placeholder='Confirm password'/>
                    </InputGroup>
                </div>
                <div className='buttonWrapper text-center'>
                    <Button className='mt-3 signUpButton'>Sign Up</Button>

                </div>
            </div>
                <div className='AlreadyRegisteredWrapper text-center fixed-bottom'>
                    <p className='alreadyRegistered'>You already have an account? <a href='/login' className='loginLink'>Log in here</a></p>
                </div>
        </Container>
    )
  }
}
