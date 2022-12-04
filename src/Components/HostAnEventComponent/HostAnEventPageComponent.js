import React, { Component } from 'react'
import { Container,Card,Button, FormControl, DropdownButton, Dropdown, InputGroup } from 'react-bootstrap'
import NavbarComponentRegisteredUser from '../NavbarComponent/NavbarComponentRegisteredUser'
import './HostAnEventPageStyles/HostAnEventComponentStyles.css'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';
import SidebarComponent from '../SidebarComponent/SidebarComponent'
export default class HostAnEventPageComponent extends Component {

    constructor()
    {
        super()
        this.state = {eventType: '', eventCategory: '', eventLocation: '', eventDate: ''}
        this.handleSelect = this.handleSelect.bind(this)
        this.handleSelectCategory = this.handleSelectCategory.bind(this)
        this.handleSelectLocation = this.handleSelectLocation.bind(this)
        this.handleSelectDate = this.handleSelectDate.bind(this)
    }
    handleSelect(value){
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
        let dropdown = document.querySelector('.eventDateField');
        let formattedDate = value.toString().split(' ').splice(1,3).join(' ');
        dropdown.placeholder = formattedDate;
        this.setState({'eventDate': formattedDate})
    }
    HostEvent()
    {
        console.log(this.state)
    }
  render() {
    return (
        <div>

            <SidebarComponent/>
            <Container>
                <NavbarComponentRegisteredUser/>
                <Card className='HostEventCard'>
                    <Card.Body>
                        <div className='row'>
                            <div className='eventNameWrapper col-sm mt-5'>
                                <h2 className='fieldLabel'>Event name</h2>
                                <FormControl className='inputField' placeholder='Enter your event Name'/>
                            </div>
                            <div className='eventTypeWrapper col-sm mt-5'>
                                <h2 className='fieldLabel'>Event type</h2>
                                <InputGroup>
                                <FormControl className='inputField eventTypeField' placeholder='Public' aria-describedby='dropdownAddon' disabled='true'/>
                                    <DropdownButton className='inputFieldDropdown' id='dropdownAddon' onSelect={this.handleSelect}>
                                        <Dropdown.Item eventKey = {'Public'}>Public</Dropdown.Item>
                                        <Dropdown.Item eventKey = {'Private'} >Private</Dropdown.Item>
                                    </DropdownButton>
                                
                                </InputGroup>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='eventDescriptionWrapper col-sm mt-5'>
                                <h2 className='fieldLabel'>Event description</h2>
                                <FormControl className='inputField' placeholder='Event description'/>
                            </div>
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
                            </div>
                        </div>

                        <div className='row'>
                        <div className='eventCategoryWrapper col-sm mt-5'>
                                <h2 className='fieldLabel'>Event Location</h2>
                                <FormControl className='inputField eventLocationField' placeholder='e.g. Menlo Park'/>

                            </div>
                            <div className='eventCategoryWrapper col-sm mt-5'>
                                <h2 className='fieldLabel'>Event Date</h2>
                                <InputGroup>
                                    <FormControl className='inputField eventDateField' placeholder='e.g. 28/01/2022' disabled='true'/>
                                    <DropdownButton className='inputFieldDropdown' id='dropdownAddon' drop='start'>
                                        <Calendar onChange={this.handleSelectDate}/>
                                    </DropdownButton>
                                </InputGroup>
                            </div>
                        </div>
                        
                        <div className='buttonWrapper d-flex justify-content-center mt-3'>
                            <Button className='hostEventButton' onClick={() => this.HostEvent()}>Host event</Button>
                        </div>
                    </Card.Body>
                </Card>
            </Container>
    
        </div>)
  }
}
