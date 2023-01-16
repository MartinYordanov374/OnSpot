import React, { Component } from 'react'
import SidebarComponent from '../SidebarComponent/SidebarComponent';
import { Container } from 'react-bootstrap'
import Axios from 'axios'
import SquareEventCardComponent from '../SquareEventCardComponent/SquareEventCardComponent';

export default class RegisteredLandingPage extends Component {
    constructor()
    {
      super()
      this.state = {events: [], initialEventElementID: 0, isLoading: false, endReached: false}
    }

    componentDidMount()
    {
      this.getFirstTwoEvents()
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
        .then((res) => {
            this.setState((prevState) => (
              {
                'events': [...prevState.events, res.data]
              })
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
            setTimeout(() => {
              this.setState({'isLoading': false})

            }, 600)
          }
        })
        .catch((err) => {console.log(err)})
    }

    
    
    render() {
    return (
        <div>
              <SidebarComponent/>
                <Container className='EventCardsContainer'>
                      <div className='EventCardsWrapper row' style={{'margin-left': '2%'}}>

                        { this.state.events.map((eventsList) => {
                            return(
                                eventsList.map((event) => {
                                  return <SquareEventCardComponent props={event}/>

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
