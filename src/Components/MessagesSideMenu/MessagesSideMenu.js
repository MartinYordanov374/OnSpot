import React, { Component } from 'react'
import './Styles/MessagesStyles.css'
import { faEnvelope, faAngleUp, faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import conversation from '../../Images/conversation.png'
import Axios from 'axios'

export default class MessagesSideMenu extends Component {
    constructor()
    {
        super()
        this.state = {
            isMessageBoxExpanded: false,
            allUserConversations: []
        }
    }

    handleChatBox = () => {
        if(this.state.isMessageBoxExpanded == true)
        {
            this.setState({'isMessageBoxExpanded': false})
        }
        else
        {
            this.setState({'isMessageBoxExpanded': true})
        }
    }

    componentDidMount()
    {
        Axios.get('http://localhost:3030/GetAllUserConversations', {withCredentials: true})
        .then((res) => {
            this.setState({'allUserConversations': res.data.data})
        })
        .catch((err) => {
            console.log('An error occured, outer catch: ', err)
        })
    }
  render() {
    return (
        <div className='MessagesMenuWrapper'>
            {this.state.isMessageBoxExpanded == false ?
                <div className='MessagesSideMenu' >
                    <div className='MessagesTextWrapper' onClick={() => this.handleChatBox()}>
                        <span className='MessagesText'>Messages</span>
                    </div>
                    <div className='MessagesButtonsWrapper'>
                        <FontAwesomeIcon className='MessagesIcon' icon={faEnvelope}/>
                        <FontAwesomeIcon className='MessagesIcon' icon = {faAngleUp} onClick={() => this.handleChatBox()}/>
                    </div>
                </div>
            :
            <div className='ExpandedMessagesSideMenuWrapper'>
                <div className='ExpandedMessagesSideMenu' onClick={() => this.handleChatBox()}>
                        <div className='MessagesTextWrapper'>
                            <span className='MessagesText'>Messages</span>
                        </div>
                        <div className='MessagesButtonsWrapper'>
                            <FontAwesomeIcon className='MessagesIcon' icon={faEnvelope}/>
                            <FontAwesomeIcon className='MessagesIcon' icon = {faAngleDown} onClick={() => this.handleChatBox()}/>
                        </div>
                </div>
                <div className='ChatsWrapper'>
                        {this.state.allUserConversations.map((UserConversation) => {
                            return(
                                <div className='ChatContainer' key = {UserConversation.ConvoID}>
                                    <img src = {conversation} className = 'ChatProfilePicture'/>
                                    <div className='ChatInfoWrapper'>
                                        <p className='ChatUsername'>Sample user two</p>
                                        <p className='ChatLatestMessage'>
                                            {
                                                    UserConversation.Message.length > 20 
                                                ? 
                                                    UserConversation.Message.slice(0,25) + '...'
                                                : 
                                                    UserConversation.Message
                                            }
                                        </p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            }
        </div>
     
    )
  }
}
