import React, { Component } from 'react'
import './Styles/MessagesStyles.css'
import { faEnvelope, faAngleUp, faAngleDown, faArrowLeft, faAngleLeft } from "@fortawesome/free-solid-svg-icons";
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
            currentUserData: null,
            receiverUserUsernameForSpecificChat: null
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

    openChatBox = (targetConvoObject) => {
        let targetConvoID = targetConvoObject.ConversationID
        let senderUserID = targetConvoObject.SenderUserID
        let receiverUserID = targetConvoObject.ReceiverUserID
        let senderUsername = targetConvoObject.SenderUsername
        let receiverUsername = targetConvoObject.ReceiverUsername
        if(this.state.isChatBoxOpen == true)
        {
            this.setState({'isChatBoxOpen': false})
            this.setState({'currentConversationData': null})

        }
        else
        {
            Axios.get(`http://localhost:3030/getConversationByConversationID/${targetConvoID}`, {withCredentials: true})
            .then((res) => {
                this.setState({'currentConversationData': res.data.data.data}, () => {
                    let targetUserUsername = ''
                    if(this.state.currentUserData == senderUserID)
                    {
                        targetUserUsername = receiverUsername
                    }
                    else
                    {
                        targetUserUsername = senderUsername
                    }

                    this.setState({'receiverUserUsernameForSpecificChat': targetUserUsername})
                })
            })
            .catch((err) => {
                console.log(err)
            })
            this.setState({'isChatBoxOpen': true})
        }
    }

    closeChatBox = () => {
        this.setState({'isChatBoxOpen': false})
        this.setState({'isMessageBoxExpanded': true})
        this.setState({'currentConversationData': null})
        this.setState({'receiverUserUsernameForSpecificChat': null})

    }

    getCurrentUserData = async() => {
        let returnedUserData = await Axios.get('http://localhost:3030/getUserData', {withCredentials: true})
        let targetUserData = returnedUserData.data[0]
        this.setState({'currentUserData': targetUserData})
    }

    getCurrentUserConversations = () => {
        Axios.get('http://localhost:3030/GetAllUserConversations', {withCredentials: true})
        .then((res) => {
            console.log(res.data.data)
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
                        <span className={this.state.isMessageBoxExpanded ? 'MessagesText-Expanded': 'MessagesText'}>{this.state.receiverUserUsernameForSpecificChat ? this.state.receiverUserUsernameForSpecificChat : 'Messages'}</span>
                    </div>
                    <div className='MessagesButtonsWrapper'>
                        <FontAwesomeIcon className='MessagesIcon' icon={faEnvelope}/>
                        <FontAwesomeIcon className='MessagesIcon' icon = {faAngleUp} onClick={() => this.handleChatBox()}/>
                    </div>
                </div>
            :
            <div className='ExpandedMessagesSideMenuWrapper'>
                <div className='ExpandedMessagesSideMenu'>
                        {this.state.isChatBoxOpen ? 
                                <FontAwesomeIcon className='GoBackMessagesIcon' icon={faAngleLeft} onClick = {() => this.closeChatBox()}/>
                            : 
                                ""
                        }
                        <div className='MessagesTextWrapper' onClick={() => this.handleChatBox()}>
                            <span className={this.state.isMessageBoxExpanded ? 'MessagesText-Expanded': 'MessagesText'}>{this.state.receiverUserUsernameForSpecificChat ? this.state.receiverUserUsernameForSpecificChat : 'Messages'}</span>
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
                                    <div className='ChatContainer' key = {UserConversation.ConversationID} onClick={() => this.openChatBox(UserConversation)}>
                                       {
                                            UserConversation.ReceiverUserID === this.state.currentUserData.id 
                                            ?
                                                UserConversation.SenderProfilePicture 
                                                ? 
                                                    <img src={`data:image/png;base64,${Buffer.from(UserConversation.SenderProfilePicture.data).toString('base64')}`} className='ChatProfilePicture'/>
                                                :
                                                    <img src={conversation} className='ChatProfilePicture'/>
                                            :
                                                UserConversation.ReceiverProfilePicture 
                                                ?
                                                    <img src={`data:image/png;base64,${Buffer.from(UserConversation.ReceiverProfilePicture.data).toString('base64')}`} className='ChatProfilePicture'/>
                                                :
                                                    <img src={conversation} className='ChatProfilePicture'/>
                                        }
                                        <div className='ChatInfoWrapper'>
                                            <p className='ChatUsername'>{this.state.currentUserData.Username == UserConversation.ReceiverUsername ? UserConversation.SenderUsername : UserConversation.ReceiverUsername}</p>
                                            <p className='ChatLatestMessage'>
                                                {

                                                    UserConversation.MessageSenderID == this.state.currentUserData.id ?
                                                        UserConversation.LatestMessage.length > 20 
                                                        ?
                                                            'You: ' + UserConversation.LatestMessage.slice(0,21) + '...'
                                                        :
                                                        'You: ' + UserConversation.LatestMessage
                                                    : 
                                                         UserConversation.LatestMessage.length > 20 
                                                        ?
                                                        this.state.currentUserData.Username == UserConversation.ReceiverUsername ? UserConversation.SenderUsername : UserConversation.ReceiverUsername + ': ' + UserConversation.LatestMessage.slice(0,21) + '...'
                                                        :
                                                        this.state.currentUserData.Username == UserConversation.ReceiverUsername ? UserConversation.SenderUsername : UserConversation.ReceiverUsername + ': ' + UserConversation.LatestMessage

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
                            {this.state.currentConversationData && this.state.currentUserData ? 
                                this.state.currentConversationData.map((conversationMessageObject) => {
                                    return(
                                        conversationMessageObject.SenderUserID == this.state.currentUserData.id 
                                        ?
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
