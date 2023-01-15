import React, { Component } from 'react'
import { FormControl, DropdownButton, InputGroup, Dropdown, Button } from 'react-bootstrap'
import SidebarComponent from '../SidebarComponent/SidebarComponent'
import './Styles/EditEventStyle.css'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';
export default class EditEvent extends Component {
  render() {
    return (
      <div>
        <SidebarComponent/>
        <div className='editEventFormWrapper '>
            <h1 className='updateEventHeader'>Update event </h1>
            <div className='fieldsWrapper'>
                <FormControl placeholder='Event Name' className='eventDataForm'/>
                <FormControl placeholder='Event Description' className='eventDataForm'/>
                <FormControl placeholder='Event Location' className='eventDataForm'/>
            </div>
            <div className='calendarWrapper'>
                <Calendar className='calendar' selectRange={true}/>
            </div>

            <div className='inputGroupsWrapper row'>
                <InputGroup className='eventDataForm'>
                        <FormControl placeholder='e.g. Tech' disabled='true'/>
                        <DropdownButton className='inputFieldDropdown' id='dropdownAddon' onSelect={this.handleSelectCategory} defaultValue="Hangout">
                            <Dropdown.Item eventKey = {'Tech'}>Tech</Dropdown.Item>
                            <Dropdown.Item eventKey = {'Business'} >Business</Dropdown.Item>
                            <Dropdown.Item eventKey = {'Hangout'} >Hangout</Dropdown.Item>
                            <Dropdown.Item eventKey = {'Other'} >Other</Dropdown.Item>
                        </DropdownButton>
                </InputGroup>

                <InputGroup className='eventDataForm'>
                    <FormControl placeholder='Public' aria-describedby='dropdownAddon' disabled='true'/>
                        <DropdownButton className='inputFieldDropdown' id='dropdownAddon' onSelect={this.handleSelectType} defaultValue="Public">
                            <Dropdown.Item eventKey = {'Public'}>Public</Dropdown.Item>
                            <Dropdown.Item eventKey = {'Private'} >Private</Dropdown.Item>
                        </DropdownButton>

                </InputGroup>
            </div>

            <Button className='updateEventButton'>Update event</Button>

            
        </div>
      </div>
    )
  }
}
