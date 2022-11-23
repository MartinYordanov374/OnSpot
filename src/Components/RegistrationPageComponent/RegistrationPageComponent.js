import React, { Component } from 'react'
import NavbarComponentNotRegisteredUser from '../NavbarComponent/NavbarComponentNotRegisteredUser'
import { Container, InputGroup, Form, Button } from 'react-bootstrap'
import '../RegistrationPageComponent/RegistrationPageStyles/RegistrationPageStyles.css'
export default class RegistrationPageComponent extends Component {
  render() {
    return (
        <Container>
            <NavbarComponentNotRegisteredUser/>
            <div className='SignUpComponentWrapper mx-auto'>
                <h1 className='signUpText'>Sign Up</h1>
                <div className='registrationFormWrapper'>
                    <InputGroup className='mb-5'>
                        <Form.Control placeholder='Email'/>
                        <Form.Control placeholder='Preferred username'/>
                    </InputGroup>
                    <InputGroup>
                        <Form.Control placeholder='Password'/>
                        <Form.Control placeholder='Confirm password'/>
                    </InputGroup>
                </div>
                <div className='buttonWrapper text-center'>
                    <Button className='mt-3 signUpButton'>Sign Up</Button>

                </div>
                <div className='AlreadyRegisteredWrapper text-center fixed-bottom'>
                    <p className='alreadyRegistered'>You already have an account? Log in here.</p>
                </div>
            </div>
        </Container>
    )
  }
}
