import React, { Component } from 'react'
import { Container, FormControl, Button } from 'react-bootstrap'
import NavbarComponentRegisteredUser from '../NavbarComponent/NavbarComponentRegisteredUser'
import './ExploreEventsStyles/ExploreEventsStyle.css'
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export default class ExploreEventsComponent extends Component {
  render() {
    return (
      <Container>
        <NavbarComponentRegisteredUser/>
        <div className='searchPageWrapper'>
          <div className='searchBarWrapper d-flex justify-content-center'>
            <FormControl className='searchBar d-flex' placeholder='Search events'/>
          </div>
          <div className='searchResults d-flex justify-content-center'>
            <h6>Your search results will be shown below</h6>
          </div>
        </div>

      </Container>
    )
  }
}
