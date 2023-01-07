import React, { Component } from 'react'
import { Container,Button, FormControl, DropdownButton, Dropdown, InputGroup } from 'react-bootstrap'
import './HostAnEventPageStyles/HostAnEventComponentStyles.css'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';
import Axios from 'axios'
import { toast, ToastContainer } from 'react-toastify';
export default class HostAnEventPageComponentPaginated extends Component {
    // TODO: FIGURE LOCATION OUT
    constructor()
    {
        super()
        this.state = {
            eventName: '', 
            eventDescription: '', 
            eventType: '', 
            eventCategory: '', 
            eventLocation: '', 
            eventStartDate: '', 
            eventEndDate: new Date(), 
            loginStatus: false,
            currentForm: 0
        }
        this.handleSelectType = this.handleSelectType.bind(this)
        this.handleSelectCategory = this.handleSelectCategory.bind(this)
        this.handleSelectLocation = this.handleSelectLocation.bind(this)
        this.handleSelectDate = this.handleSelectDate.bind(this)
    }
    handleSelectType(value){
        let dropdown = document.querySelector('.eventTypeField');
        dropdown.placeholder = value;
        dropdown.value = value;
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
        // dropdown.placeholder = formattedStartDate + " - " + formattedEndDate;
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
        
        // let result = Axios.post('http://localhost:3030/hostEvent', {
        //     name: this.state.eventName, 
        //     description: this.state.eventDescription,
        //     location: this.state.eventLocation,
        //     type: this.state.eventType,
        //     category: this.state.eventCategory,
        //     startDate: this.state.eventStartDate,
        //     endDate: this.state.eventEndDate    
        // }, 
        // {withCredentials: true})
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

    nextPage = (element) => {
        let targetElementInputField = element.target.parentElement.children[1]
        let targetElementInputFieldValue = targetElementInputField.value
        if(targetElementInputFieldValue.length == 0)
        {
            targetElementInputField.focus()
            targetElementInputField.style.borderColor = 'red'
            targetElementInputField.style.boxShadow = '0 0 0 0.25rem rgba(255, 0, 0, 0.25)'
        }
        else
        {
            this.setState({'currentForm': this.state.currentForm + 1})
        }

    }
    previousPage = () => {
        this.setState({'currentForm': this.state.currentForm - 1})
    }

    componentDidMount()
    {
      this.checkIfUserIsLoggedIn()
    }
  render() {
    switch(this.state.currentForm)
    {
        case 0:
            return (
                <div>
                    <Container>
                        <div className='eventNameWrapper col-sm mt-5'>
                            <h2 className='fieldLabel'>Event name</h2>
                            <FormControl className='inputField' placeholder='Enter your event Name' onChange = {(e) => this.handleEnterEventName(e.target.value)}/>
                            <Button onClick={(e) => this.nextPage(e)}>Continue</Button>
                        </div>

                    </Container>
                </div>
            )
        case 1:
            return (
                <div>
                    <Container>
                        <div className='eventTypeWrapper col-sm mt-5'>
                            <h2 className='fieldLabel'>Event type</h2>
                            <InputGroup>
                            <FormControl className='inputField eventTypeField' placeholder='Public' aria-describedby='dropdownAddon' disabled='true'/>
                                <DropdownButton className='inputFieldDropdown' id='dropdownAddon' onSelect={this.handleSelectType}>
                                    <Dropdown.Item eventKey = {'Public'}>Public</Dropdown.Item>
                                    <Dropdown.Item eventKey = {'Private'} >Private</Dropdown.Item>
                                </DropdownButton>

                            </InputGroup>
                            <Button onClick={() => this.previousPage()}>Previous</Button>   
                            <Button onClick={(e) => this.nextPage(e)}>Continue</Button>
                        </div>
                    </Container>
                </div>
            )
        case 2:
            return (
                <div>
                    <Container>
                        <div className='eventDescriptionWrapper col-sm mt-5'>
                            <h2 className='fieldLabel'>Event description</h2>
                            <FormControl className='inputField' placeholder='Event description'/>
                            {/* onChange = {(e) => this.handleEnterEventDescription(e.target.value)} */}
                            <Button onClick={() => this.previousPage()}>Previous</Button>   
                            <Button onClick={() => this.nextPage()}>Continue</Button>
                        </div>
                    </Container>
                </div>
            )
        case 3:
                return (
                    <div>
                        <Container>
                            <div className='eventCategoryWrapper col-sm mt-5'>
                                    <h2 className='fieldLabel'>Event category</h2>
                                    <InputGroup>
                                        <FormControl className='inputField eventCategoryField' placeholder='e.g. Tech' disabled='true'/>
                                        <DropdownButton className='inputFieldDropdown' id='dropdownAddon' onSelect={this.handleSelectCategory}>
                                            <Dropdown.Item eventKey = {'Tech'}>Tech</Dropdown.Item>
                                            <Dropdown.Item eventKey = {'Business'} >Business</Dropdown.Item>
                                            <Dropdown.Item eventKey = {'Hangout'} >Hangout</Dropdown.Item>
                                            <Dropdown.Item eventKey = {'Other'} >Other</Dropdown.Item>
                                        </DropdownButton>
                                    </InputGroup>
                                    <Button onClick={() => this.previousPage()}>Previous</Button>
                                    <Button onClick={() => this.nextPage()}>Continue</Button>
                            </div>
                        </Container>
                    </div>
            )
        case 4:
            return (
                <div>
                    <Container>
                            <div className='eventCategoryWrapper col-sm mt-5'>
                                <h2 className='fieldLabel'>Event Location</h2>
                                <FormControl className='inputField eventLocationField' placeholder='e.g. Menlo Park' onChange = {(e) => this.setState({'eventLocation': e.target.value})}/>
                            </div>
                            <Button onClick={() => this.previousPage()}>Previous</Button>
                            <Button onClick={() => this.nextPage()}>Continue</Button>
                    </Container>
                </div>
            )
        case 5:
            return (
                <div>
                    <ToastContainer/>
                    <Container>
                    <div className='eventCategoryWrapper col-sm mt-5'>
                            <h2 className='fieldLabel'>Event Date</h2>
                            {/* <InputGroup>
                                <FormControl className='inputField eventStartDateField' placeholder='e.g. 28/01/2022' disabled='true'/>
                                <DropdownButton className='inputFieldDropdown' id='dropdownAddon' drop='start'>
                                    <Calendar onChange={this.handleSelectDate} selectRange={true}/>
                                </DropdownButton>
                            </InputGroup> */}
                            <Calendar onChange={this.handleSelectDate} selectRange={true}/>

                            <Button onClick={() => this.previousPage()}>Previous</Button>

                            <Button onClick={() => this.HostEvent()}>Host Event</Button>
                        </div>
                    </Container>
                </div>
            )
    }
  }
}


