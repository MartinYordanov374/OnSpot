import React, { Component } from 'react'
import { Container,Button, FormControl, DropdownButton, Dropdown, InputGroup } from 'react-bootstrap'
import './HostAnEventPageStyles/HostAnEventComponentStyles.css'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';
import Axios from 'axios'
import { toast, ToastContainer } from 'react-toastify';
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
export default class HostAnEventPageComponentPaginated extends Component {
    // TODO: FIGURE LOCATION OUT
    constructor()
    {
        super()
        this.state = {
            eventName: '', 
            eventDescription: '', 
            eventType: 'public', 
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
        dropdown.value = value;
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
        .then((res) => {
            toast.success(res.data)
        })
        .catch((err) => {
            console.log(err)
        })
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
        if(element.target.parentElement.className=='buttonsWrapper')
        {
            targetElementInputField = element.target.parentElement.parentElement.children[1].children[0]
            targetElementInputFieldValue = targetElementInputField.value
            if(targetElementInputFieldValue == undefined || targetElementInputFieldValue.length == 0 )
            {
                toast.warn(`You can't have an empty field!`)
            }
            else
            {
                this.setState({'currentForm': this.state.currentForm + 1})
            }
        }
        else
        {
            if(targetElementInputField.className == 'input-group')
            {
                targetElementInputField = targetElementInputField.children[0]
                targetElementInputFieldValue = targetElementInputField.value
            }
    
            if(targetElementInputFieldValue.length == 0)
            {
                toast.warn(`You can't have an empty field!`)
            }
            else
            {
                this.setState({'currentForm': this.state.currentForm + 1})
            }
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
                <div className='hostEventPage'>
                    <ToastContainer/>
                    <Container>
                        <div className='eventNameWrapper col-sm mt-5'>
                            <h2 className='fieldLabel'>Event name</h2>
                            <FormControl className='inputField' placeholder='Enter your event Name' onChange = {(e) => this.handleEnterEventName(e.target.value)}/>
                            <Button className='continueBtn' onClick={(e) => this.nextPage(e)}>
                                <FontAwesomeIcon icon = {faChevronRight}/>
                            </Button>
                        </div>

                    </Container>
                </div>
            )
        // case 1:
        //     return (
        //         <div className='hostEventPage'>
        //             <ToastContainer/>
        //             <Container>
        //                 <div className='eventTypeWrapper row'>
        //                     <h2 className='fieldLabel'>Event type</h2>
        //                     <InputGroup>
        //                         <FormControl className='inputField eventTypeField' placeholder='Public' aria-describedby='dropdownAddon' disabled='true'/>
        //                         <DropdownButton className='inputFieldDropdown' id='dropdownAddon' onSelect={this.handleSelectType} defaultValue="Public">
        //                             <Dropdown.Item eventKey = {'Public'}>Public</Dropdown.Item>
        //                             <Dropdown.Item eventKey = {'Private'} >Private</Dropdown.Item>
        //                         </DropdownButton>
        //                     </InputGroup>
        //                     <div className='buttonsWrapper'>
        //                         <Button className='previousBtn col-sm-2' onClick={() => this.previousPage()}>
        //                             <FontAwesomeIcon icon = {faChevronLeft}/>
        //                         </Button>   
        //                         <Button className='continueBtn col-sm-2' onClick={(e) => this.nextPage(e)}>
        //                             <FontAwesomeIcon icon = {faChevronRight}/>
        //                         </Button>

        //                     </div>
        //                 </div>
        //             </Container>
        //         </div>
        //     )
        case 1:
            return (
                <div className='hostEventPage'>
                    <ToastContainer/>
                    <Container>
                        <div className='eventDescriptionWrapper row'>
                            <h2 className='fieldLabel'>Event description</h2>
                            <FormControl className='inputField' placeholder='Event description' onChange = {(e) => this.handleEnterEventDescription(e.target.value)}/>
                            <Button className='previousBtn col-sm' onClick={() => this.previousPage()}>
                                <FontAwesomeIcon icon = {faChevronLeft}/>
                            </Button>   
                            <Button className='continueBtn col-sm' onClick={(e) => this.nextPage(e)}>
                                <FontAwesomeIcon icon = {faChevronRight}/>
                            </Button>
                        </div>
                    </Container>
                </div>
            )
        case 2:
                return (
                    <div className='hostEventPage'>
                        <ToastContainer/>
                        <Container>
                            <div className='eventCategoryWrapper row'>
                                    <h2 className='fieldLabel'>Event category</h2>
                                    <InputGroup>
                                        <FormControl className='inputField eventCategoryField' placeholder='e.g. Tech' disabled='true'/>
                                        <DropdownButton className='inputFieldDropdown' id='dropdownAddon' onSelect={this.handleSelectCategory} defaultValue="Hangout">
                                            <Dropdown.Item eventKey = {'Tech'}>Tech</Dropdown.Item>
                                            <Dropdown.Item eventKey = {'Business'} >Business</Dropdown.Item>
                                            <Dropdown.Item eventKey = {'Hangout'} >Hangout</Dropdown.Item>
                                            <Dropdown.Item eventKey = {'Other'} >Other</Dropdown.Item>
                                        </DropdownButton>
                                    </InputGroup>
                                    <Button className='previousBtn col-sm' onClick={() => this.previousPage()}>
                                        <FontAwesomeIcon icon = {faChevronLeft}/>
                                    </Button>
                                    <Button className='continueBtn col-sm' onClick={(e) => this.nextPage(e)}>
                                        <FontAwesomeIcon icon = {faChevronRight}/>
                                    </Button>
                            </div>
                        </Container>
                    </div>
            )
        case 3:
            return (
                <div className='hostEventPage'>
                    <ToastContainer/>
                    <Container>
                            <div className='eventCategoryWrapper row'>
                                <h2 className='fieldLabel'>Event Location</h2>
                                <FormControl className='inputField eventLocationField' placeholder='e.g. Menlo Park' onChange = {(e) => this.setState({'eventLocation': e.target.value})}/>
                                <Button className='previousBtn col-sm' onClick={() => this.previousPage()}>
                                    <FontAwesomeIcon icon = {faChevronLeft}/>
                                </Button>
                                <Button className='continueBtn col-sm' onClick={(e) => this.nextPage(e)}>
                                    <FontAwesomeIcon icon = {faChevronRight}/>
                                </Button>
                            </div>
                    </Container>
                </div>
            )
        case 4:
            return (
                <div className='hostEventPage'>
                    <ToastContainer/>
                    <Container>
                        <div className='eventCategoryWrapper row'>
                                <h2 className='fieldLabel'>Event Date</h2>
                                <Calendar className='calendar' onChange={this.handleSelectDate} selectRange={true}/>
                                <Button className='previousBtn col-sm' onClick={() => this.previousPage()}>
                                    <FontAwesomeIcon icon = {faChevronLeft}/>
                                </Button>
                                <Button className='continueBtn col-sm' onClick={() => this.HostEvent()}>Host Event</Button>
                        </div>
                    </Container>
                </div>
            )
    }
  }
}


