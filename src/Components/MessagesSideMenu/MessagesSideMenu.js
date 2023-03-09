import React, { Component } from 'react'
import './Styles/MessagesStyles.css'
import { faEnvelope, faAngleUp, faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import conversation from '../../Images/conversation.png'
export default class MessagesSideMenu extends Component {
    constructor()
    {
        super()
        this.state = {
            isMessageBoxExpanded: false
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
                        <div className='ChatContainer'>
                            <img src = {conversation} className = 'ChatProfilePicture'/>
                            <div className='ChatInfoWrapper'>
                                <p className='ChatUsername'>Sample user two</p>
                                <p className='ChatLatestMessage'>Latest message...</p>
                            </div>
                        </div>

                        <div className='ChatContainer'>
                            <img src = {conversation} className = 'ChatProfilePicture'/>
                            <div className='ChatInfoWrapper'>
                                <p className='ChatUsername'>Sample user two</p>
                                <p className='ChatLatestMessage'>Latest message...</p>
                            </div>

                        </div>
                    </div>
                </div>
            }
        </div>
     
    )
  }
}
