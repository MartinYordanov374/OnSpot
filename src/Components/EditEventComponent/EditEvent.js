import React, { Component } from 'react'
import { FormControl, DropdownButton, InputGroup, Dropdown, Button } from 'react-bootstrap'
import SidebarComponent from '../SidebarComponent/SidebarComponent'
import './Styles/EditEventStyle.css'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';
import Axios from 'axios'
import LandingPageComponent from '../LandingPageComponent/LandingPageComponent'

export default class EditEvent extends Component {
    constructor()
    {
        super()
        this.state = {
            targetEventName: '', 
            targetEventClass: '', 
            targetEventType: '', 
            targetEventDesc: '', 
            targetEventLocaction: '', 
            targetEventStartDate: '', 
            targetEventEndDate: '',
            targetEventHostId: '',  
            targetEventID: '', 
            loginStatus: false,
            isLoading: true,
            isUserHoster: false
        }
        this.splittedUrl = window.location.href.split('/')
        this.targetID = this.splittedUrl[this.splittedUrl.length - 1]
    }
    async GetTargetEventData()
    {
        
        await Axios.get(`http://localhost:3030/getEventById/${this.targetID}`, {withCredentials: true})
        .then((res) => {
            console.log(res)
            this.setState({
                'targetEventName': res.data.EventName, 
                'targetEventClass': res.data.EventClass, 
                'targetEventType': res.data.EventType,
                'targetEventDesc': res.data.EventDescription, 
                'targetEventLocaction': res.data.EventLocation,
                'targetEventStartDate': res.data.EventStartDate.split('T')[0].split('-').join('/'),
                'targetEventEndDate': res.data.EventEndDate.split('T')[0].split('-').join('/'),
                'targetEventID': this.targetID
            })
            this.CheckIfUserIsOwner()
            this.setState({'isLoading': false})
        })
    }
    async CheckIfUserIsOwner()
    {
        await Axios.get(`http://localhost:3030/isUserEventOwner/${this.targetID}`, {withCredentials: true})
        .then((res) => {
            if(res.data.isUserOwner == true)
            {
                this.setState({'isUserHoster': true})
            }
            else
            {
                this.setState({'isUserHoster': false})
            }
        })
        .catch((err) => {
            // console.log(err)
        })
    }

    checkIfUserIsLoggedIn = async () => {
        await Axios.get('http://localhost:3030/isUserLoggedIn', {withCredentials: true})
        .then((res)=>{
          if(res.data == true)
          {
              this.setState({'loginStatus': true})
              this.CheckIfUserIsOwner()
          }
          else
          {
            this.setState({'loginStatus': false})
          }})
      }

      handleSelectDate(value)
      {
        let [startDate, endDate] = value
        let formattedStartDate = startDate.toString().split(' ').splice(1,3).join(' ');
        let formattedEndDate = endDate.toString().split(' ').splice(1,3).join(' ');
        this.setState({'targetEventStartDate': formattedStartDate, 'targetEventEndDate': formattedEndDate})
      }

      handleEnterEventName(value)
      {
          this.setState({'targetEventName': value})
      }
      handleEnterEventDescription(value)
      {
         
          this.setState({'targetEventDesc': value})
      }

      handleSelectType(value)
      {
        let dropdown = document.querySelector('.eventTypeField');
        dropdown.value = value;
        this.setState({'targetEventType': value})
    }  
    handleSelectCategory(value)
    {
        let dropdown = document.querySelector('.eventCategoryField');
        dropdown.value = value;
        this.setState({'targetEventCategory': value})
    }
    handleSelectLocation(value)
    {
        let dropdown = document.querySelector('.eventCategoryField');
        dropdown.value = value;
        this.setState({'targetEventLocaction': value})
    }

    componentDidMount()
    {
        this.GetTargetEventData()
        this.checkIfUserIsLoggedIn()
    }
  render() {
    if(this.state.isUserHoster == true)
    {
        return (
        <div>
            <SidebarComponent/>
            {this.state.isLoading == true ?
                <div className='d-flex justify-content-center'>
                <div class="spinner-border text-primary loadingSpinnerWrapper" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                </div>
                :
                <div className='editEventFormWrapper '>
                    <h1 className='updateEventHeader'>Update event </h1>
                    <div className='fieldsWrapper'>
                        <FormControl 
                        placeholder='Event Name' 
                        value = {this.state.targetEventName} 
                        className='eventDataForm'
                        onChange = {(e) => this.handleEnterEventName(e.target.value)}

                        />

                        <FormControl 
                        placeholder='Event Description' 
                        value={this.state.targetEventDesc} 
                        className='eventDataForm'
                        onChange = {(e) => this.handleEnterEventDescription(e.target.value)}
                        />

                        <FormControl 
                        placeholder='Event Location' 
                        value = {this.state.targetEventLocaction}
                        className='eventDataForm'
                        onChange = {(e) => this.handleSelectLocation(e.target.value)}
                        />

                        <FormControl 
                        placeholder='Event Start Date' 
                        value = {this.state.targetEventStartDate}
                        className='eventDataForm'/>

                        <FormControl 
                        placeholder='Event End Date' 
                        value = {this.state.targetEventEndDate}
                        className='eventDataForm'/>

                    </div>
                    <div className='calendarWrapper'>
                        <Calendar className='calendar' selectRange={true} onChange={(e) => this.handleSelectDate(e)}/>
                    </div>

                    <div className='inputGroupsWrapper row'>
                        <InputGroup className='eventDataForm'>
                                <FormControl className='eventCategoryField' value={this.state.targetEventClass} disabled='true' />
                                <DropdownButton className='inputFieldDropdown' id='dropdownAddon' 
                                onSelect={this.handleSelectCategory} defaultValue="Hangout">
                                    <Dropdown.Item eventKey = {'Tech'}>Tech</Dropdown.Item>
                                    <Dropdown.Item eventKey = {'Business'} >Business</Dropdown.Item>
                                    <Dropdown.Item eventKey = {'Hangout'} >Hangout</Dropdown.Item>
                                    <Dropdown.Item eventKey = {'Other'} >Other</Dropdown.Item>
                                </DropdownButton>
                        </InputGroup>

                        <InputGroup className='eventDataForm'>
                            <FormControl className='eventTypeField' value={this.state.targetEventType == 0 ? "Public" : "Private"} aria-describedby='dropdownAddon' disabled='true' />
                                <DropdownButton className='inputFieldDropdown' id='dropdownAddon' onSelect={this.handleSelectType} defaultValue="Public">
                                    <Dropdown.Item eventKey = {'Public'}>Public</Dropdown.Item>
                                    <Dropdown.Item eventKey = {'Private'} >Private</Dropdown.Item>
                                </DropdownButton>

                        </InputGroup>
                    </div>

                    <Button className='updateEventButton'>Update event</Button>

                    
                </div>
            }
        </div>
        )
    }
    else
    {
        return (
            <LandingPageComponent/>
        )
    }
  }
}
