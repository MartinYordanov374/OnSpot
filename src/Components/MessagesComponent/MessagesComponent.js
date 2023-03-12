import React, { Component } from 'react'
import SidebarComponent from '../SidebarComponent/SidebarComponent'
import './Styles/MessagesStyles.css'
import { faEnvelope, faAngleUp, faAngleDown, faArrowLeft, faAngleLeft, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {FormControl, Button, InputGroup} from 'react-bootstrap'

export default class MessagesComponent extends Component {
    constructor()
    {
        super();
        this.state = {
            UserConversations: [
                1,2
            ],
            currentConversationData: [
                {
                    SenderUserID: 2,
                    Message: 'Hello!'
                },
                {
                    SenderUserID: 1,
                    Message: 'Hey!'
                }
            ],
            currentUserData: {
                id: 1
            }
        }
    }
  render() {
    return (
      <div className='MessagesWrapper'>
        <SidebarComponent/>
        <div className='MessagesContainer'>
            <div className='ConversationContainer'>
                {this.state.UserConversations.map((conversation) => {
                    return(
                        <div className='ConversationBubble'>
                            {/* image */}
                            <img src='https://pfpmaker.com/_nuxt/img/profile-3-1.3e702c5.png' className='ChatProfilePicture'/>
                            {/* username */}
                            <p className='UserConversationUsername'> Username </p>
                            {/* last message */}
                            <p className='ConversationLastMessage'> last message</p>
                        </div>
                    )
                })}
            </div>
            <div className='Chat'>
                <div className='ReceiverWrapper'>
                    <img src='https://pfpmaker.com/_nuxt/img/profile-3-1.3e702c5.png' className='ChatProfilePicture'/>
                    <p className='ReceiverUsername'>Username</p>
                </div>
                <div className='ChatMessagesWrapper'>
                    { this.state.currentConversationData.map((conversationMessageObject) => {
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
                        }
                </div>
                <div className='SendMessageWrapper'>
                            <InputGroup className='chatInteractionButtons'>
                                <FormControl className='sendMessageInputField' onChange={(e) => this.setState({'message': e.target.value})}/>
                                <Button variant="primary" className='sendMessageBtn' onClick={() => this.sendMessage()}>
                                    <FontAwesomeIcon icon={faPaperPlane}/>
                                </Button>
                            </InputGroup>
                </div>
            </div>
        </div>
      </div>
    )
  }
}
