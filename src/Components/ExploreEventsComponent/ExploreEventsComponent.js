import React, { Component } from 'react'
import { Container, FormControl, InputGroup } from 'react-bootstrap'
import NonRegisteredLandingPage from '../LandingPageComponent/NonRegisteredLandingPage'
import NavbarComponentRegisteredUser from '../NavbarComponent/NavbarComponentRegisteredUser'
import SidebarComponent from '../SidebarComponent/SidebarComponent'
import './ExploreEventsStyles/ExploreEventsStyle.css'
import Axios from 'axios'
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { findDistance } from '../../KeyWordSimilarityAlgorithm/LevenshteinDistance'
import SquareEventCardComponent from '../SquareEventCardComponent/SquareEventCardComponent';

export default class ExploreEventsComponent extends Component {
  constructor()
  {
    super()
    this.state = {
      userData: [], 
      isLoading: true, 
      loginStatus: false, 
      searchTerm: '',
      searchResults: [],
      areSearchResultsLoaded: false}
  }
  componentDidMount = () =>
  {
    this.checkIfUserIsLoggedIn()
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
  componentDidUpdate()
  {
    this.checkIfUserIsLoggedIn()
  }
  searchOnSpot = async() => {
    let allEvents = await this.getAllEvents()
    let allEventsSplittedTitles = []
    let searchTermSplittedByWords = this.state.searchTerm.split(' ')
    let levenshteinDistancesOverall = []
    allEvents.map((event) => {
      let splittedTitle = event.EventName.split(' ')
      allEventsSplittedTitles.push({event: event, splittedTitle: splittedTitle})
    })
    allEventsSplittedTitles.map((eventTitleObject) => {
      let levenshteinDistancesRelative = []
      eventTitleObject.splittedTitle.map((word) => {
        searchTermSplittedByWords.map((searchTermWord) => {
          let distance = findDistance(searchTermWord.toLowerCase(), word.toLowerCase())
          levenshteinDistancesRelative.push(distance)
        })
      })
      let cummulativeDistances = levenshteinDistancesRelative.reduce((prev, next) => {return prev + next}) / levenshteinDistancesRelative.length
      levenshteinDistancesOverall.push({
         targetEventObject: eventTitleObject,
        cummulativeDistance: cummulativeDistances
      })
    })
    levenshteinDistancesOverall.sort((a,b) => {
      return a.cummulativeDistance - b.cummulativeDistance
    })
    this.setState({'searchResults': levenshteinDistancesOverall}, () => {
      this.setState({'areSearchResultsLoaded': true})
    })
    this.setState({'searchTerm': ''})

    // take the result with the smallest number result
    // track it back to the original event
    // show this event and the others behind this event (sorted by the levenshtein distance result)
    // save those results to the data analytics table -> user ID - event Category

  }

  getAllEvents = async() => {
    let result = await Axios.get('http://localhost:3030/getAllSearchedEvents', {withCredentials: true})
    return result.data.result.recordset
  }

  render() {
    return (
      <div>
        {this.state.loginStatus == true ?
        <div>
          <SidebarComponent/>
          <Container>
            {/* <NavbarComponentRegisteredUser/> */}
            <div className='searchPageWrapper'>
              <div className='searchBarWrapper d-flex justify-content-center'>
                <InputGroup  className='searchBar d-flex'>
                  <FormControl placeholder='Search events' onChange={(e) => this.setState({'searchTerm': e.target.value})} value={this.state.searchTerm} className='searchInput shadow-none'/>
                  <InputGroup.Text 
                      className='SearchButton' 
                      onClick={() => this.searchOnSpot()}
                  >
                    <FontAwesomeIcon 
                      icon = {faMagnifyingGlass} 
                    />
                  </InputGroup.Text>
                </InputGroup>
              </div>
              {this.state.searchResults.length <= 0 ?
              <div className='searchResults d-flex justify-content-center'>
                <h6>Your search results will be shown below</h6>
              </div>
              :
              <div className='searchResults eventsContainer'>
                {this.state.areSearchResultsLoaded == true 
                ?
                  this.state.searchResults.map((searchResult) => {
                    let event = searchResult.targetEventObject.event
                    return <SquareEventCardComponent props={event}/>
                  })
                :
                  ""
                }
              </div>
              }
            </div>

          </Container>
        </div>
      : 
      <NonRegisteredLandingPage/>}
      </div>

    )
  }
}
