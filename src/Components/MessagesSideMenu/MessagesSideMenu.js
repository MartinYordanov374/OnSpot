import React, { Component } from 'react'
import './Styles/MessagesStyles.css'
import { faEnvelope, faAngleUp, faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import conversation from '../../Images/conversation.png'
import Axios from 'axios'
import { Buffer } from 'buffer';

export default class MessagesSideMenu extends Component {
    constructor()
    {
        super()
        this.state = {
            isMessageBoxExpanded: false,
            allUserConversations: [],
            isChatBoxOpen: false,
            currentConversationData: null,
            currentUserData: null
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

    openChatBox = (convoID) => {
        if(this.state.isChatBoxOpen == true)
        {
            this.setState({'isChatBoxOpen': false})
            this.setState({'currentConversationData': null})

        }
        else
        {
            Axios.get(`http://localhost:3030/getConversationByConversationID/${convoID}`, {withCredentials: true})
            .then((res) => {
                this.setState({'currentConversationData': res.data.data.data})
            })
            .catch((err) => {
                console.log(err)
            })
            this.setState({'isChatBoxOpen': true})
        }
    }

    getCurrentUserData = async() => {
        let returnedUserData = await Axios.get('http://localhost:3030/getUserData', {withCredentials: true})
        let targetUserData = returnedUserData.data[0]
        this.setState({'currentUserData': targetUserData})
    }

    getCurrentUserConversations = () => {
        Axios.get('http://localhost:3030/GetAllUserConversations', {withCredentials: true})
        .then((res) => {
            this.setState({'allUserConversations': res.data.data})
        })
        .catch((err) => {
            console.log('An error occured, outer catch: ', err)
        })
    }

    componentDidMount = async() =>
    {
        await this.getCurrentUserData()
        this.getCurrentUserConversations()
       
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
                {
                this.state.isChatBoxOpen == false 
                ? 
                    <div className='ChatsWrapper'>
                            {this.state.allUserConversations.map((UserConversation) => {
                                return(
                                    <div className='ChatContainer' key = {UserConversation.ConversationID} onClick={() => this.openChatBox(UserConversation.ConversationID)}>
                                        {
                                            UserConversation.ReceiverProfilePicture 
                                            ?
                                                <img  src={
                                                    `data: image/png;base64,
                                                        ${Buffer.from(UserConversation.ReceiverProfilePicture.data).toString('base64')}`
                                                        } 
                                                    className = 'ChatProfilePicture'/>
                                            :
                                                <img src = {conversation} className = 'ChatProfilePicture'/>
                                        }
                                        <div className='ChatInfoWrapper'>
                                            <p className='ChatUsername'>{UserConversation.ReceiverUsername}</p>
                                            <p className='ChatLatestMessage'>
                                                {
                                                        UserConversation.LatestMessage.length > 20 
                                                    ? 
                                                        UserConversation.LatestMessage.slice(0,25) + '...'
                                                    : 
                                                        UserConversation.LatestMessage
                                                }
                                            </p>    
                                        </div>
                                    </div>
                                )
                            })}
                    </div>
                :
                    <div className='ChatsWrapper'>
                            
                        <div className='SpecificChatContainer'>
                            <h1>Chat username</h1>
                            {this.state.currentConversationData && this.state.currentUserData ? 
                                this.state.currentConversationData.map((conversationMessageObject) => {
                                    return(
                                    conversationMessageObject.SenderUserID == this.state.currentUserData.id ?
                                        <div className='senderMessage message'>
                                            {conversationMessageObject.Message}
                                        </div> 
                                        :
                                        <div className='receiverMessage message'>
                                            {conversationMessageObject.Message}
                                        </div> 
                                    )
                                      
                                })
                                :
                                ""
                            }
                            
                        </div>
                                       
                    </div>
                }
            </div>
            }
        </div>
     
    )
  }
}
