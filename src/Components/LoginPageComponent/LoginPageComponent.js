import React, { Component } from 'react'
import NavbarComponentNotRegisteredUser from '../NavbarComponent/NavbarComponentNotRegisteredUser'
import { Container, InputGroup, Form, Button, Toast } from 'react-bootstrap'
import '../LoginPageComponent/LoginPageStyles/LoginPageStyles.css'
import Axios from 'axios'
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default class LoginPageComponent extends Component {

  constructor()
  {
      super()
      this.state = {email: '',  password: ''}
  }
  LoginUser = async () =>
  {
      let email = this.state.email
      let password = this.state.password
      if(email.length <= 0 || password.length <= 0 )
      {
          toast.warn('You can not have any empty fields!')
      }
      else
      {
          let res = await Axios.post(`http://localhost:3030/login`, 
          {email: email, password: password}, {withCredentials: true})
          .then((res) => {
              toast.success(res.data.msg)
              window.location.href = '/'
          })
          .catch((err) => toast.warn(err.response.data) )
      }
      
  }
  render() {
    return (
      <Container>
        <NavbarComponentNotRegisteredUser/>
        <ToastContainer/>
        <div className='LoginFormWrapper'>
            <h1 className='logInText'>Log In</h1>
            <Form.Control className='EmailField field' placeholder='Email' onChange={(e) => this.setState({'email': e.target.value})}/>      
            <Form.Control className='PasswordField field' placeholder='Password' type='password' onChange={(e) => this.setState({'password': e.target.value})}/>   
            <div className='logInButtonWrapper'>
                <Button className='LogInButton' onClick={() => this.LoginUser()}> Log In </Button>
            </div> 
        </div>
        <div className='NotRegisteredYetWrapper text-center fixed-bottom'>
                <p className='NotRegisteredYet'>You don't have an account yet? <a href='/register' className='registerLink'>Register here.</a></p>
        </div>
      </Container>
    )
  }
}
