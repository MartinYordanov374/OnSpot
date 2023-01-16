import React, { Component } from 'react'
import Axios from 'axios'
import './Styles/UserFollowers.css'

export default class UserFollowers extends Component {
    constructor()
    {
        super()
        this.state = {
            userFollowersList: [],
            userFollowersIDList: []
        }
    }

    componentDidMount = () => {
        this.splittedUrl = window.location.href.split('/')
        this.targetID = this.splittedUrl[this.splittedUrl.length - 1]
        this.getUserFollowers(this.targetID)
    }
    getUserFollowers = async (targetUserID) => {
        await Axios.get(`http://localhost:3030/getUserFollowers/${targetUserID}`)
        .then((res) => {
          this.setState({'userFollowersIDList':res.data}, () => {
            this.state.userFollowersIDList.map(async(follower) => {
                await Axios.post(`http://localhost:3030/getUserDataById/${follower.FollowerUserID}`)
                .then((res) => {
                  this.setState((prevState) => (
                    {'userFollowersList':[...prevState.userFollowersList, res.data]}
                    ), 
                    () => {
                    console.log(this.state.userFollowersList)
                  })
                })
            })
          })
        })
    
      }
  render() {
    return (
      <div className='followersWrapper'>
        {this.state.userFollowersList.map((follower) => {
            return (
                <div className='followerContainer'>
                    {follower.ProfilePicture.data 
                        ?
                        <img 
                        src={
                            `data: image/png;base64,
                            ${Buffer.from(follower.ProfilePicture.data).toString('base64')}`
                        }
                        className='userPFP'
                        />
                        :
                        <img 
                        src={`${follower.ProfilePicture}`}
                        className='userPFP'
                        />
                    }
                    <h1 className='followerName'>{follower.Username}</h1>
                </div>
            )
        })}
      </div>
    )
  }
}
