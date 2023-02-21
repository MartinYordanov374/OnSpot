import React, { Component } from 'react'
import NavbarComponentNotRegisteredUser from '../NavbarComponent/NavbarComponentNotRegisteredUser'
import { Container, InputGroup, Form, Button } from 'react-bootstrap'
import '../RegistrationPageComponent/RegistrationPageStyles/RegistrationPageStyles.css'
import Axios from 'axios'
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
        if(username.length <= 0 || email.length <= 0 || password.length <= 0 || confirmPassword.length <= 0)
        {
            toast.warn('You can not have any empty fields!')
        }
        else
        {
            if(password != confirmPassword)
            {
                toast.warn('Your passwords do not match !')
            }
            else
            {
                let res = await Axios.post(`http://localhost:3030/register`, 
                {username: username, email: email, password: password}, {withCredentials: true})
                .then((res) => {
                    toast.success(res.data)
                    setTimeout(() => {
                        window.location = '/login'
                    }, 3000)
                })
                .catch((err) => toast.warn(err.response.data) )
            }
        }
    }
    return (
        <Container>
            <NavbarComponentNotRegisteredUser/>
            <ToastContainer/>
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
                    <p className='alreadyRegistered'>You already have an account? <a href='/login' className='loginLink'>Log in here.</a></p>
                </div>
        </Container>
    )
  }
}
