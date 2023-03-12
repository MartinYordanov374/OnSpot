import React, { Component } from 'react'
import SidebarComponent from '../SidebarComponent/SidebarComponent'
import './Styles/MessagesStyles.css'
import { faEnvelope, faAngleUp, faAngleDown, faArrowLeft, faAngleLeft, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {FormControl, Button, InputGroup} from 'react-bootstrap'
import io from 'socket.io-client';
import Axios from 'axios'

export default class MessagesComponent extends Component {
    constructor()
    {
        super();
        this.state = {
            allUserConversations: [],
            // currentConversationData: null,
            currentUserData: null
        }
    }

    getCurrentUserData = async() => {
        let returnedUserData = await Axios.get('http://localhost:3030/getUserData', {withCredentials: true})
        let targetUserData = returnedUserData.data[0]
        this.setState({'currentUserData': targetUserData})
    }

    getCurrentUserConversations = async() => {
        await Axios.get('http://localhost:3030/GetAllUserConversations', {withCredentials: true})
        .then((res) => {
            console.log(res)
            this.setState({'allUserConversations': res.data.data})
        })
        .catch((err) => {
            console.log('An error occured, outer catch: ', err)
        })
    }

    sendMessage = async () => {
        try {
          const receiverID =
            this.state.currentUserData.id === this.state.receiverUserIdForSpecificChat
              ? this.state.senderUserIdForSpecificChat
              : this.state.receiverUserIdForSpecificChat;
      
          const currentUserID = this.state.currentUserData.id;
          const socket = io("http://localhost:3030");
      
          socket.emit("sendMessage", {
            senderID: currentUserID,
            receiverID: receiverID,
            message: this.state.message
          });
        socket.emit('requestConvo', {'receiverID': Number(receiverID), 'senderID':Number(currentUserID)})

          socket.emit("notify", {
            notificationData: { senderID: currentUserID, receiverID: receiverID },
            isMessage: true,
            isPost: false,
            isFollower: false,
            isComment: false
          });
      
          const messageInputField = document.querySelector(".sendMessageInputField");
          messageInputField.value = "";
        } catch (err) {
          console.log(err);
        }
      };
      

    componentDidMount = async() => {
        await this.getCurrentUserData()
        this.getCurrentUserConversations()
        this.socket = io('http://localhost:3030');
        this.socket.on("newMessage", async (data) => {
            const { senderID, receiverID, message } = data;

                  this.setState({ 'currentConversationData': data.data }, () => {
                    console.log(this.state.currentConversationData)
                  });

                  this.setState({'message': null})
              })
      }
    componentWillUnmount() {
        if (this.socket) {
          this.socket.disconnect();
        }
      }
  render() {
    return (
      <div className='MessagesWrapper'>
        <SidebarComponent/>
        <div className='MessagesContainer'>
            <div className='ConversationContainer'>
                {this.state.allUserConversations.map((conversation) => {
                    return(
                        <div className='ConversationBubble'>
                            {/* image */}
                            <img src='https://pfpmaker.com/_nuxt/img/profile-3-1.3e702c5.png' className='ChatProfilePicture'/>
                            {/* username */}
                            <p className='UserConversationUsername'>{this.state.currentUserData.Username == conversation.ReceiverUsername ? conversation.SenderUsername : conversation.ReceiverUsername}</p>
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
                    {/* { this.state.currentConversationData.map((conversationMessageObject) => {
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
                        } */}
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
