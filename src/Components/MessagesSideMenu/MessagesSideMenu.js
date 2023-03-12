import React, { Component } from 'react'
import './Styles/MessagesStyles.css'
import { faEnvelope, faAngleUp, faAngleDown, faArrowLeft, faAngleLeft, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import conversation from '../../Images/conversation.png'
import Axios from 'axios'
import {FormControl, Button, InputGroup} from 'react-bootstrap'
import io from 'socket.io-client';
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
            receiverUserUsernameForSpecificChat: null, 
            receiverUserIdForSpecificChat: null,
            senderUserIdForSpecificChat: null,
            message: '',
            socket: null
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

    openChatBox = async (targetConvoObject) => {
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
            await Axios.get(`http://localhost:3030/getConversationByConversationID/${targetConvoID}`, {withCredentials: true})
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
                    this.setState({'receiverUserIdForSpecificChat': receiverUserID})
                    this.setState({'senderUserIdForSpecificChat': senderUserID})

                })
            })
            .catch((err) => {
                console.log(err)
            })
            this.setState({'isChatBoxOpen': true})
        }

        // this.state.socket.on('connect', (socket) => {
        //     let socketReceiverID = this.state.currentUserData.id == receiverUserID ? senderUserID : receiverUserID
        //     socket.emit('requestConvo', {'receiverID': Number(socketReceiverID), 'senderID':Number(this.state.currentUserData.id)}, () => {
              
        //     })
        //     socket.on('getConvo', (res) => {
        //       this.setState({'conversationMessages': res.data})
    
        //     })
        //   })
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

    getCurrentUserConversations = async() => {
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
      
        //   const result = await Axios.post(
        //     `http://localhost:3030/sendMessage/${receiverID}`,
        //     { message: this.state.message },
        //     { withCredentials: true }
        //   );
      
          const currentUserID = this.state.currentUserData.id;
          const socket = io("http://localhost:3030");
      
          socket.emit("sendMessage", {
            senderID: currentUserID,
            receiverID: receiverID,
            message: this.state.message
          });
      
        //   socket.on("newMessage", async (data) => {
        //     const { senderID, receiverID, message } = data;
        //     if (receiverID === currentUserID && senderID === receiverID) {
        //       const conversationData = await Axios.get(
        //         `http://localhost:3030/getConversation/${receiverID}`,
        //         { withCredentials: true }
        //       ).then(() => {
        //           this.setState({ 'currentConversationData': conversationData.data }, () => {
        //             // console.log(this.state.currentConversationData)
        //           });

        //           this.setState({'message': null})
        //       })
        //     }
        //   });



        socket.emit('requestConvo', {'receiverID': Number(receiverID), 'senderID':Number(currentUserID)})
  
        // socket.on('getConvo', (res) => {
        //       this.setState({'currentConversationData': res.data}, async () => {
        //          await this.getCurrentUserConversations()

        //       })
        // })
      
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
        <div className='MessagesMenuWrapper'>
            {this.state.isMessageBoxExpanded == false ?
                <div className='MessagesSideMenu' >
                    <div className='MessagesTextWrapper' onClick={() => this.handleChatBox()}>
                        {/* TODO: Make the text be the other user always! */}
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
            }
        </div>
     
    )
  }
}
