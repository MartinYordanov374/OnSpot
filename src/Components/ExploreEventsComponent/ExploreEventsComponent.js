import React, { Component } from 'react'
import { Container, FormControl } from 'react-bootstrap'
import NonRegisteredLandingPage from '../LandingPageComponent/NonRegisteredLandingPage'
import NavbarComponentRegisteredUser from '../NavbarComponent/NavbarComponentRegisteredUser'
import SidebarComponent from '../SidebarComponent/SidebarComponent'
import './ExploreEventsStyles/ExploreEventsStyle.css'
import Axios from 'axios'
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { findDistance } from '../../KeyWordSimilarityAlgorithm/LevenshteinDistance'

export default class ExploreEventsComponent extends Component {
  constructor()
  {
    super()
    this.state = {userData: [], isLoading: true, loginStatus: false, searchTerm: ''}
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
  searchOnSpot = async() => {
    // get all events from the database
    let allEvents = await this.getAllEvents()
    let allEventsSplittedTitles = []
    let searchTermSplittedByWords = this.state.searchTerm.split(' ')
    let levenshteinDistancesOverall = []
    allEvents.map((event) => {
      // split their titles to each word
      let splittedTitle = event.EventName.split(' ')
      allEventsSplittedTitles.push({event: event.EventID, splittedTitle: splittedTitle})
    })

    // run the search term (splitted) + each title splitted word through the levenshtein distance algorithm
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
         eventID: eventTitleObject,
        cummulativeDistance: cummulativeDistances
      })
    })
    console.log(levenshteinDistancesOverall)
    // take the result with the smallest number result
    // track it back to the original event
    // show this event and the others behind this event (sorted by the levenshtein distance result)
    // save those results to the data analytics table -> user ID - event Category
  }

  getAllEvents = async() => {
    let result = await Axios.get('http://localhost:3030/getAllEvents', {withCredentials: true})
    return result.data.payload
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
                <FormControl className='searchBar d-flex' placeholder='Search events' onChange={(e) => this.setState({'searchTerm': e.target.value})}/>
                <FontAwesomeIcon 
                  icon = {faMagnifyingGlass} 
                  onClick={() => this.searchOnSpot()}
                  className='SearchButton'
                />
              </div>
              <div className='searchResults d-flex justify-content-center'>
                <h6>Your search results will be shown below</h6>
              </div>
            </div>

          </Container>
        </div>
      : 
      <NonRegisteredLandingPage/>}
      </div>

    )
  }
}
