import React, { Component } from 'react'
import { Container,Card,Button, FormControl, DropdownButton, Dropdown, InputGroup } from 'react-bootstrap'
import NavbarComponentRegisteredUser from '../NavbarComponent/NavbarComponentRegisteredUser'
import './HostAnEventPageStyles/HostAnEventComponentStyles.css'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';
import SidebarComponent from '../SidebarComponent/SidebarComponent'
import Axios from 'axios'
import NonRegisteredLandingPage from '../LandingPageComponent/NonRegisteredLandingPage'
import HostAnEventPageComponentPaginated from './HostAnEventPageComponentPaginated'
import {toast, ToastContainer} from 'react-toastify'

export default class HostAnEventPageComponent extends Component {
    constructor()
    {
        super()
        this.state = {eventName: '', eventDescription: '', eventType: '', eventCategory: '', eventLocation: '', eventStartDate: '', eventEndDate: new Date(), loginStatus: false}
        this.handleSelectType = this.handleSelectType.bind(this)
        this.handleSelectCategory = this.handleSelectCategory.bind(this)
        this.handleSelectLocation = this.handleSelectLocation.bind(this)
        this.handleSelectDate = this.handleSelectDate.bind(this)
    }
    handleSelectType(value){
        let dropdown = document.querySelector('.eventTypeField');
        dropdown.placeholder = value;
        this.setState({'eventType': value})
    }  
    handleSelectCategory(value)
    {
        let dropdown = document.querySelector('.eventCategoryField');
        dropdown.placeholder = value;
        this.setState({'eventCategory': value})
    }
    handleSelectLocation(value)
    {
        let dropdown = document.querySelector('.eventLocationField');
        dropdown.placeholder = value;
        this.setState({'eventLocation': value})
    }
    handleSelectDate(value)
    {
        let [startDate, endDate] = value
        let dropdown = document.querySelector('.eventStartDateField');
        let formattedStartDate = startDate.toString().split(' ').splice(1,3).join(' ');
        let formattedEndDate = endDate.toString().split(' ').splice(1,3).join(' ');
        dropdown.placeholder = formattedStartDate + " - " + formattedEndDate;
        this.setState({'eventStartDate': formattedStartDate, 'eventEndDate': formattedEndDate})
    }

    handleEnterEventName(value)
    {
        this.setState({'eventName': value})
    }
    handleEnterEventDescription(value)
    {
       
        this.setState({'eventDescription': value})
    }
    HostEvent()
    {   
        let result = Axios.post('http://localhost:3030/hostEvent', {
            name: this.state.eventName, 
            description: this.state.eventDescription,
            location: this.state.eventLocation,
            type: this.state.eventType,
            category: this.state.eventCategory,
            startDate: this.state.eventStartDate,
            endDate: this.state.eventEndDate    
        }, 
        {withCredentials: true})
    }

    checkIfUserIsLoggedIn = async () => {
        await Axios.get('http://localhost:3030/isUserLoggedIn', {withCredentials: true})
        .then((res)=>{
          if(res.data == true)
          {
            
              this.setState({'loginStatus': true})
          }
          else
          {
            this.setState({'loginStatus': false})
          }})
      }

    componentDidMount()
    {
      this.checkIfUserIsLoggedIn()
    }
  render() {
    return (
        <div>
            {this.state.loginStatus == true ? 
                <div>
                    <SidebarComponent/>
                    <Container>
                        <HostAnEventPageComponentPaginated/>
                    </Container>
                </div>
            : 
                <NonRegisteredLandingPage/>
            }
    
        </div>)
  }
}


