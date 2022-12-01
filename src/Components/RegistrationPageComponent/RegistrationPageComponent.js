import React, { Component } from 'react'
import NavbarComponentNotRegisteredUser from '../NavbarComponent/NavbarComponentNotRegisteredUser'
import { Container, InputGroup, Form, Button } from 'react-bootstrap'
import '../RegistrationPageComponent/RegistrationPageStyles/RegistrationPageStyles.css'
import Axios from 'axios'
export default class RegistrationPageComponent extends Component {

    constructor()
    {
        super()
        this.state = {username: '', email: '',  password: '', confirmPassword: ''}
    }
    render() {
    const RegisterUser = async () =>
    {
        let username = this.state.username
        let email = this.state.email
        let password = this.state.password
        let confirmPassword = this.state.confirmPassword

        let res = await Axios.post(`http://localhost:3030/register`, 
        {username: username, email: email, password: password}, {withCredentials: true})
        .then((res) => console.log(res.data))
        .catch((err) => console.log(err.response.data) )
    }
    return (
        <Container>
            <NavbarComponentNotRegisteredUser/>
            <div className='SignUpComponentWrapper ' >
                <h1 className='signUpText'>Sign Up</h1>
                <div className='registrationFormWrapper'>
                    <InputGroup className='emailUsernameForms mb-5' >
                        <Form.Control className='emailField field left' placeholder='Email' onChange={(e) => this.setState({'email': e.target.value})}/>
                        <Form.Control className='usernameField field right' placeholder='Preferred username' onChange={(e) => this.setState({'username': e.target.value})}/>
                    </InputGroup>
                    <InputGroup className = 'passwordForms'>
                        <Form.Control className = 'passwordField field left'  type='password' placeholder='Password' onChange={(e) => this.setState({'password': e.target.value})}/>
                        <Form.Control className = 'confirmPasswordField field left' type='password' placeholder='Confirm password' onChange={(e) => this.setState({'confirmPassword': e.target.value})}/>
                    </InputGroup>
                </div>
                <div className='buttonWrapper text-center'>
                    <Button className='mt-3 signUpButton' onClick={() => RegisterUser()}>Sign Up</Button>

                </div>
            </div>
                <div className='AlreadyRegisteredWrapper text-center fixed-bottom'>
                    <p className='alreadyRegistered'>You already have an account? <a href='/login' className='loginLink'>Log in here</a></p>
                </div>
        </Container>
    )
  }
}
