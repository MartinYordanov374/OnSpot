import React, { Component } from 'react'
import SidebarComponent from '../SidebarComponent/SidebarComponent'
import './Styles/MessagesStyles.css'
import { faEnvelope, faAngleUp, faAngleDown, faArrowLeft, faAngleLeft, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {FormControl, Button, InputGroup} from 'react-bootstrap'
import io from 'socket.io-client';
import Axios from 'axios'
import defaultPp from '../../Images/conversation.png'
import { Buffer } from 'buffer';

export default class MessagesComponent extends Component {
    constructor()
    {
        super();
        this.state = {
            allUserConversations: [],
            currentConversationData: [],
            currentUserData: {},
            isChatBoxOpen: false,
            receiverUserUsernameForSpecificChat: '',
            receiverUserIdForSpecificChat: '',
            senderUserIdForSpecificChat: 0,
            senderUserProfilePicture: '',
            receiverUserProfilePicture: defaultPp,
            senderUserUsernameForSpecificChat: ''
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
            this.setState({'allUserConversations': res.data.data}, () => {
              this.openChatBox(this.state.allUserConversations[0])
            })
        })
        .catch((err) => {
            console.log('An error occured, outer catch: ', err)
        })
    }

    updateCurrentUserConversations = async() => {
      await Axios.get('http://localhost:3030/GetAllUserConversations', {withCredentials: true})
      .then((res) => {
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

            socket.emit('requestConvo', {
              'receiverID': Number(receiverID), 
              'senderID':Number(currentUserID)
            })

            socket.emit("notify", {
              notificationData: { senderID: currentUserID, receiverID: receiverID },
              isMessage: true,
              isPost: false,
              isFollower: false,
              isComment: false
            });
        
            const messageInputField = document.querySelector(".sendMessageInputField");
            messageInputField.value = "";

            
          } 
        catch (err) 
        {
          console.log(err);
        }
      };
    openChatBox = async (targetConvoObject) => {
        let targetConvoID = targetConvoObject.ConversationID
        let senderUserID = targetConvoObject.SenderUserID
        let receiverUserID = targetConvoObject.ReceiverUserID
        let senderUsername = targetConvoObject.SenderUsername
        let receiverUsername = targetConvoObject.ReceiverUsername
        await Axios.get(`http://localhost:3030/getConversationByConversationID/${targetConvoID}`, {withCredentials: true})
        .then( (res) => {
            this.setState({'currentConversationData': res.data.data.data}, async () => {
                let targetUserUsername = ''
                let targetProfilePicture = {}
                if(this.state.currentUserData.id == senderUserID)
                {
                    targetUserUsername = receiverUsername
                }
                else
                {
                    targetUserUsername = senderUsername
                }

                if(targetConvoObject.ReceiverUserID === this.state.currentUserData.id )
                {
                  if(targetConvoObject.SenderProfilePicture )
                  { 
                    targetProfilePicture = targetConvoObject.SenderProfilePicture.data
                  }
                  else
                  {
                    targetProfilePicture = defaultPp
                  }
                }
                else
                {
                  if(targetConvoObject.ReceiverProfilePicture )
                  {
                    targetProfilePicture = targetConvoObject.ReceiverProfilePicture.data
                  }
                  else
                  {
                    targetProfilePicture = defaultPp
                  }
               }
              this.setState({'receiverUserUsernameForSpecificChat': targetUserUsername}, () => {
                this.setState({'receiverUserIdForSpecificChat': receiverUserID}, () => {
                  this.setState({'senderUserIdForSpecificChat': senderUserID}, () => {
                    this.setState({'receiverUserProfilePicture': targetProfilePicture}, () => {
                      this.setState({'isChatBoxOpen': true})
                    })
                  })
                })
              })

            })
        })
        .catch((err) => {
            console.log(err)
        })
    }

    componentDidMount = async() => {
        await this.getCurrentUserData()
        this.getCurrentUserConversations()
        this.socket = io('http://localhost:3030');
        this.socket.on("newMessage", async (data) => {
            const { senderID, receiverID, message } = data;
                  await this.updateCurrentUserConversations()

                  this.setState({ 'currentConversationData': data.data }, () => {
                    // console.log(this.state.currentConversationData)
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
        {/* TODO: Users should be able to visit the profile page of any user they're chatting with by pressing their profile name */}
        <SidebarComponent/>
        <div className='MessagesContainer'>
            <div className='ConversationContainer'>
                {this.state.allUserConversations.map((conversation) => {
                    return(
                        <div className='ConversationBubble' key={conversation.ConversationID} onClick={() => this.openChatBox(conversation)}>
                            {
                              conversation.ReceiverUserID === this.state.currentUserData.id 
                              ?
                                conversation.SenderProfilePicture 
                                    ? 
                                        <img src={`data:image/png;base64,${Buffer.from(conversation.SenderProfilePicture.data).toString('base64')}`} className='ChatProfilePicture'/>
                                    :
                                        <img src={defaultPp} className='ChatProfilePicture'/>
                              :
                                conversation.ReceiverProfilePicture 
                                    ?
                                       <img src={`data:image/png;base64,${Buffer.from(conversation.ReceiverProfilePicture.data).toString('base64')}`} className='ChatProfilePicture'/>
                                    :
                                        <img src={defaultPp} className='ChatProfilePicture'/>
                            }
                            <div className='ChatInfoWrapper'>
                              <p className='UserConversationUsername'>{this.state.currentUserData.Username == conversation.ReceiverUsername ? conversation.SenderUsername : conversation.ReceiverUsername}</p>
                                <p className='ConversationLastMessage'>
                                  {

                                    conversation.MessageSenderID == this.state.currentUserData.id ?
                                    conversation.LatestMessage != null && conversation.LatestMessage.length > 20 
                                    ?
                                      'You: ' + conversation.LatestMessage.slice(0,21) + '...'
                                          :
                                      'You: ' + conversation.LatestMessage
                                    : 
                                    conversation.LatestMessage != null && conversation.LatestMessage.length > 20 
                                      ?
                                      this.state.currentUserData.Username == conversation.ReceiverUsername 
                                        ? 
                                          conversation.SenderUsername 
                                        : 
                                          conversation.ReceiverUsername + ': ' + conversation.LatestMessage.slice(0,21) + '...'
                                      :
                                      this.state.currentUserData.Username == conversation.ReceiverUsername ? conversation.SenderUsername : conversation.ReceiverUsername + ': ' + conversation.LatestMessage
                                  }
                              </p>    
                             </div>
                        </div>
                    )
                })}
            </div>
            {this.state.isChatBoxOpen ?
            <div className='Chat'>
                <div className='ReceiverWrapper'>
                  { this.state.receiverUserProfilePicture != defaultPp 
                  ?
                    <img src={`data:image/png;base64,${Buffer.from(this.state.receiverUserProfilePicture).toString('base64')}`} className='ChatProfilePicture'/>
                    :
                    <img src={defaultPp} className='ChatProfilePicture'/>

                  }
                    <p className='ReceiverUsername'>{this.state.receiverUserUsernameForSpecificChat} </p>
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
            :
                        <div className='Chat'>
                <div className='ReceiverWrapper'>
                  {this.state.ReceiverProfilePicture ?
                    <img src={`data:image/png;base64,${Buffer.from(this.state.receiverUserProfilePicture).toString('base64')}`} className='ChatProfilePicture'/>
                    :
                    <img src={defaultPp} className='ChatProfilePicture'/>
                  }
                    <p className='ReceiverUsername'>{this.state.receiverUserUsernameForSpecificChat} </p>
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
            }
        </div>
      </div>
    )
  }
}
