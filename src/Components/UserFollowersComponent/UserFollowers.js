import React, { Component } from 'react'
import Axios from 'axios'
import './Styles/UserFollowers.css'
import SidebarComponent from '../SidebarComponent/SidebarComponent'
import { Buffer } from 'buffer';
import LandingPageComponent from '../LandingPageComponent/LandingPageComponent';

export default class UserFollowers extends Component {
    constructor()
    {
        super()
        this.state = {
            userFollowersList: [],
            userFollowersIDList: [],
            targetUserData: [],
            loginStatus: false
        }
    }

    componentDidMount = () => {
        this.splittedUrl = window.location.href.split('/')
        this.targetID = this.splittedUrl[this.splittedUrl.length - 1]
        this.checkIfUserIsLoggedIn()
        this.getUserFollowers(this.targetID)
        this.getUserData(this.targetID)
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
                  })
                })
            })
          })
        })
    
    }
    getUserData = async(targetUserID) => {
        await Axios.post(`http://localhost:3030/getUserDataById/${targetUserID}`, {}, {withCredentials: true})
        .then((res) => {
            this.setState({'targetUserData': res.data})
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
  render() {
    return (
        <div>
          {this.state.loginStatus == true ?
            <div>
              <SidebarComponent/>
              <div className='followersWrapper'>
                  <h1>{this.state.targetUserData.Username+"'s"} followers</h1>
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
                  <span>No more users to show</span>
              </div>
            </div>
          :
          <LandingPageComponent/>}
        </div>
    )
  }
}
