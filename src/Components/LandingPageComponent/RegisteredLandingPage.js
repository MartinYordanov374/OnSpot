import React, { Component } from 'react'
import SidebarComponent from '../SidebarComponent/SidebarComponent';
import { Container } from 'react-bootstrap'
import Axios from 'axios'
import SquareEventCardComponent from '../SquareEventCardComponent/SquareEventCardComponent';
import MessagesSideMenu from '../MessagesSideMenu/MessagesSideMenu';

export default class RegisteredLandingPage extends Component {
    constructor()
    {
      super()
      this.state = {events: [], initialEventElementID: 0, isLoading: false, endReached: false, eventsOrder: []}
    }

    componentDidMount()
    {
      this.getFirstTwoEvents()
      this.getUserPreferences()
      window.addEventListener('scroll', this.checkIfUserScrolledToBottom);
    }
    componentWillUnmount()
    {
      window.removeEventListener('scroll', this.checkIfUserScrolledToBottom)
    }

    checkIfUserScrolledToBottom = async () =>{
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
         this.setState({'isLoading': true})

         this.setState({'initialEventElementID': this.state.initialEventElementID + 2}, async () => {
           await this.getNextTwoEvents()
         })

         
        }
      }
      getFirstTwoEvents = () => {
        Axios.get(`http://localhost:3030/getNextTwoEvents/0`, {withCredentials: true})
        .then( async (res) => {
          for(let targetEventID in res.data)
          {
            let targetEventData = res.data[targetEventID]
            let EventImages = await this.GetTargetEventImages(targetEventData.EventID)
            if(EventImages.length > 0)
            {
              targetEventData['EventImages'] = EventImages
            }
          }
          this.setState((prevState) => (
              {
                'events': [...prevState.events, res.data]
              }),
              
            )

            setTimeout(() => {
              this.setState({'isLoading': false})

            }, 600)
          
        })
        .catch((err) => {console.log(err)})
      }
      getNextTwoEvents = () => {
        Axios.get(`http://localhost:3030/getNextTwoEvents/${this.state.initialEventElementID}`, {withCredentials: true})
        .then((res) => {
          if(res.data != [])
          {
            this.setState((prevState) => ({
              'events': [...prevState.events, res.data]
            }))
            this.sortEventsByClass()
            setTimeout(() => {
              this.setState({'isLoading': false})

            }, 600)
          }
        })
        .catch((err) => {console.log(err)})
    }
    getUserPreferences = async () => {
      await Axios.get('http://localhost:3030/GetUserPreferences', {withCredentials: true})
    }

    async GetTargetEventImages(targetID)
    {
      let result = await Axios.get(`http://localhost:3030/GetEventImages/${targetID}`, {withCredentials: true})
      return result.data.result
    }

    render() {
    return (
        <div>
              <SidebarComponent/>
                <Container className='EventCardsContainer'>
                      <MessagesSideMenu/>
                      <div className='EventCardsWrapper row' style={{'margin-left': '2%'}}>
                        <h2>For you</h2>
                        { this.state.events.map((eventsList) => {
                            return(
                                eventsList.map((event) => {
                                  return (
                                  <div style={{"marginTop": "2%"}}>
                                    <SquareEventCardComponent props={event}/>
                                  </div>)

                                  })
                                )
                            })
                        }

                        {this.state.isLoading == true ?
                        <div className='d-flex justify-content-center'>
                          <div class="spinner-border text-primary loadingSpinnerWrapper" role="status">
                            <span class="visually-hidden">Loading...</span>
                          </div>
                        </div>
                        :
                          ""
                        }
                      </div>
                        
                </Container>
        </div>
    )
  }
}
