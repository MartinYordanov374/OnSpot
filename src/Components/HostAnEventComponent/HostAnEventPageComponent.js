import React, { Component } from 'react'
import { Container,Card,Button, FormControl, DropdownButton, Dropdown, InputGroup } from 'react-bootstrap'
import NavbarComponentRegisteredUser from '../NavbarComponent/NavbarComponentRegisteredUser'
import './HostAnEventPageStyles/HostAnEventComponentStyles.css'
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
export default class HostAnEventPageComponent extends Component {

handleSelect(value){
    let dropdown = document.querySelector('.eventTypeField')
    dropdown.placeholder = value
  }
  handleSelectCategory(value)
  {
    let dropdown = document.querySelector('.eventCategoryField')
    dropdown.placeholder = value
  }
  render() {
    return (
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
                    <div className='buttonWrapper d-flex justify-content-center mt-3'>
                        <Button className='hostEventButton'>Host event</Button>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    )
  }
}
