import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faCommentAlt, faShare, faThumbsUp, faEllipsis, faTrash, faShareNodes, faSquarePlus } from "@fortawesome/free-solid-svg-icons";
import { Container, Button,Card, FormControl, InputGroup, Dropdown } from 'react-bootstrap'
import Axios from 'axios'
import './Styles/PostStyles.css'
import { Buffer } from 'buffer';
import PostCommentComponent from '../PostCommentComponent/PostCommenComponentt';
import io from 'socket.io-client'
import PostImagesModalComponent from '../ImagesModalComponent/PostImagesModalComponent';

export default class PostComponent extends Component {

  constructor()
  {
    super()
    this.state = {
      postOwnerData: null,
      isLoading: true,
      areCommentsSelected: false,
      postComments: [],
      commentContent: '',
      currentUserData: {},
      postLikesAmount: 0,
      postLikers: [],
      hasUserLikedThisPost: false,
      postSharesAmount: 0,
      isPostShared: false,
      socket: null,
      isImagesModalShown: false,
      selectedModalImages: []
      }
  }
  getPosterData = async(userID) => {
    await Axios.post(`http://localhost:3030/getUserDataById/${userID}`, {}, {withCredentials: true})
    .then((res) => {
      this.setState({'postOwnerData': res.data}, () => {
        this.setState({'isLoading': false})

      })
    })
  }
  getCurrentUserData = async() => {
    await Axios.get(`http://localhost:3030/getUserData`, {withCredentials: true})
    .then((res) => {
      this.setState({'currentUserData': res.data})
    })
    .catch((err) => {
      console.log(err)
    })
  }
  getPostComments = async(postID) => {
    await Axios.get(`http://localhost:3030/getPostComments/${postID}`, {}, {withCredentials: true})
    .then((res) => {
      this.setState({'postComments': res.data}, () => {
      })
    })
  }
  showComments = () => {
    if(this.state.areCommentsSelected == true )
    {
      this.setState({'areCommentsSelected': false})
    }
    else
    {
      this.setState({'areCommentsSelected': true})
      console.log(this.props.postData.PostID)
      this.getPostComments(this.props.postData.PostID)
    }
  }
  postComment = async() => {
    let targetPostID = this.props.postData.PostID
    let commentContent = this.state.commentContent
    let result = await Axios.post(`http://localhost:3030/createPost`, {
      PostContent: commentContent,
      targetPostID: targetPostID
    }, {withCredentials: true})
    .then((res) => {
      this.getPostComments(this.props.postData.PostID)
      this.socket.emit('notify', {
        notificationData: {
        senderID: this.state.currentUserData[0].id,
        postID: this.props.postData.PostID,
        receiverID: this.props.postData.UserID},
        isMessage: false,
        isPost: false,
        isFollower: false,
        isComment: true
        
      })
      this.setState({'commentContent': ''})
      
      
    })
    .catch((err) => {
      console.log(err)
    })
  }
  getPostLikes = async(postID) => {
    await Axios.get(`http://localhost:3030/getTotalPostLikes/${postID}`)
    .then((res) => {
      this.setState({'postLikesAmount': res.data.likesAmount.result.recordset[0].postLikesTotal})
    })
    .catch((err) => {
      console.log(err)
    })
  }
  hasUserLikedThisPost = async(postID) => {
    await Axios.get(`http://localhost:3030/hasUserLikedPost/${postID}`, {withCredentials: true})
    .then((res) => {
      if(res.data.LikersIDList.result.recordset[0] != undefined)
      {
        this.setState({'hasUserLikedThisPost': true})
      }
      else
      {
        this.setState({'hasUserLikedThisPost': false})

      }
    })
    .catch((err) => {
      console.log(err)
    })
  }
  deletePost = async() => {
    await Axios.delete(`http://localhost:3030/DeletePost/${this.props.postData.PostID}`)
    .then((res) => {
      this.props.dataHandler()

    })
  } 
  likePost = async() => {
   await Axios.post(`http://localhost:3030/likePost/${this.props.postData.PostID}`, {}, {withCredentials: true})
   .then((res) => {
    this.hasUserLikedThisPost(this.props.postData.PostID)
    this.getPostLikes(this.props.postData.PostID)

    this.socket.emit('notify', {
      notificationData: {
      senderID: this.state.currentUserData[0].id,
      postID: this.props.postData.PostID,
      receiverID: this.props.postData.UserID},
      isMessage: false,
      isPost: false,
      isFollower: false,
      isComment: false,
      isLike: true,
      isShare: false
    })

   })
   .catch((err) => {
    console.log(err)
   })
  }
  getPostShares = async(postID) => {
    await Axios.get(`http://localhost:3030/getPostShares/${postID}`)
    .then((res) => {
        this.setState({'postSharesAmount': res.data.PostSharesAmount.result.recordset[0].postSharesTotal})
        this.props.dataHandler()
    }, {withCredentials: true})
    .catch((err) => {
      console.log(err)
    })
  }


  sharePost = async() => {
    await Axios.post(`http://localhost:3030/sharePost/${this.props.postData.PostID}`, {},  {withCredentials: true})
    .then((res) => {
      this.getPostShares(this.props.postData.PostID)
      this.getPostComments(this.props.postData.PostID)
      this.props.dataHandler()
      this.socket.emit('notify', {
        notificationData: {
        senderID: this.state.currentUserData[0].id,
        postID: this.props.postData.PostID,
        receiverID: this.props.postData.UserID},
        isMessage: false,
        isPost: false,
        isFollower: false,
        isComment: false,
        isLike: false,
        isShare: true
      })
    })
    .catch((err) => {
      console.log(err)
    })
  }
  deleteSharedPost = async() => {
    await Axios.delete(`http://localhost:3030/deleteSharedPost/${this.props.postData.PostID}`, {withCredentials: true})
    .then((res) => {
      this.getPostShares(this.props.postData.PostID)
    })
    .catch((err) => {
      console.log(err)
    })
  }
  showImagesModal = (postImages) => {
    if(this.state.isImagesModalShown == true)
    {
      this.setState({'isImagesModalShown': false})
    }
    else
    {
      if(postImages)
      {
        this.setState({'selectedModalImages': postImages}, () => {
          this.setState({'isImagesModalShown': true})
        })
      }
      
    }
  }
  componentDidMount = async () => {
    this.socket = io.connect('http://localhost:3030/')
    this.getCurrentUserData()
    this.getPosterData(this.props.postData.UserID)
    this.getPostComments(this.props.postData.Post)
    this.getPostLikes(this.props.postData.PostID)
    this.hasUserLikedThisPost(this.props.postData.PostID)
    this.getPostShares(this.props.postData.PostID)
    this.setState({'isPostShared': this.props.isShared})
    this.setState({'postImages': this.props.postImages})
  }


  render() {
    return (
      <div className='postWrapper' key={this.props.postData.PostID} id = {this.props.postData.PostID}>
        {this.state.isImagesModalShown == true && this.state.selectedModalImages != []
        ?
          <PostImagesModalComponent props={{'handleImages': this.showImagesModal, 'selectImages': this.state.selectedModalImages}}/>
        :
          ""
        }
        {this.state.isLoading == false ? 

          <div>
            {this.state.isPostShared == true 
            ? 
              <div className='sharedPostIndicator'>
                <FontAwesomeIcon icon={faShareNodes}/>
                {/* TODO: Fix the paragraph below so that it shows the username of the sharer */}
                
                <p className='shareText'>{this.props.postData.SharerUsername} shared a post </p>
              </div>
            : 
            ""
            }
          <Card className='eventPost'>
            {/* TODO: ADD LINK TO THE PROFILE PAGE TO THE HEADER ELEMENT  */}
            <Card.Header className='eventHeader'>
            {this.state.postOwnerData.ProfilePicture.data 
                        ?
                          <img 
                              src={
                                `data: image/png;base64,
                                ${Buffer.from(this.state.postOwnerData.ProfilePicture.data).toString('base64')}`
                                }
                              className='posterPFP'
                          />
                        :
                          <img 
                            src={`${this.state.postOwnerData.ProfilePicture}`}
                            className='posterPFP'
                          />
              }
              {this.state.postOwnerData
              ? 
                <span className='posterUsername'> {this.state.postOwnerData.Username}</span>
              :
                ""
              }
             
              {this.props.postData.UserID == this.state.currentUserData[0].id ?
              <Dropdown>
                <Dropdown.Toggle className='morePostOptionsButton btn-light'>
                      <FontAwesomeIcon icon={faEllipsis}/>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {this.state.isPostShared == false ? 
                  <Dropdown.Item onClick={() => this.deletePost()}>
                    <FontAwesomeIcon icon={faTrash}/> Delete post
                  </Dropdown.Item>
                  :
                  <Dropdown.Item onClick={() => this.deleteSharedPost()}>
                    <FontAwesomeIcon icon={faTrash}/> Delete post
                  </Dropdown.Item>
                  } 
                </Dropdown.Menu>
              </Dropdown>
              :
              ""}
            </Card.Header>
            <Card.Body>
              <Card.Text>
                {this.props.postData.PostContent}
              </Card.Text>
                
                <div className='PostImageWrapper'>
                  {this.state.postImages.length > 3 
                  ? 
                    <div className="imageContainer">
                      <img 
                        src={
                          `data: image/png;base64,
                          ${Buffer.from(this.state.postImages[0].PostImage.data).toString('base64')}`
                        }
                        className = 'PostImage'
                        onClick={() => { this.showImagesModal(this.state.postImages) }}
                      />
                      <span className="overlayIcon">
                        <FontAwesomeIcon icon={faSquarePlus} className = ''/>
                        {/* <p className='overlayText text-center'>click to show {this.state.postImages.length-1}  more pictures.</p> */}
                      </span>
                    </div>
                    :
                    this.state.postImages.map((image) => {
                      return(
                          <img 
                            src={
                              `data: image/png;base64,
                              ${Buffer.from(image.PostImage.data).toString('base64')}`
                            }
                            className = 'PostImage'
                            onClick={() => { this.showImagesModal(image) }}
                        />
                      )
                    })
                  }
                  
               </div>
 
            </Card.Body>
            <Card.Footer className='postInteractionButtons'>
              <div className='row'>
                {this.state.hasUserLikedThisPost == false ?
                  <span className='col-sm-4 interactionButton' onClick={() => this.likePost()}>
                    <FontAwesomeIcon icon={faThumbsUp}/> Like {this.state.postLikesAmount > 0 ? this.state.postLikesAmount : ""} 
                  </span>
                :
                  <span className='col-sm-4 interactionButton' onClick={() => this.likePost()}>
                    <FontAwesomeIcon icon={faThumbsUp}/> Liked {this.state.postLikesAmount > 0 ? this.state.postLikesAmount : ""} 
                  </span>
                }
                <span className='col-sm-4 interactionButton' onClick={()=> this.showComments()}>
                  <FontAwesomeIcon icon={faCommentAlt}/> Comments
                </span>
                <span className='col-sm-4 interactionButton' onClick={() => this.sharePost()}>
                  <FontAwesomeIcon icon={faShare}/> Share {this.state.postSharesAmount}
                </span> 
              </div>
            </Card.Footer>
            <div className={this.state.areCommentsSelected == true ? 'CommentsWrapper d-block' : 'CommentsWrapper d-none'}>
              <InputGroup className='writeCommenttWrapper'>
                  <FormControl placeholder='Write a comment..' className='commentInputField shadow-none' value={this.state.commentContent} onChange={(e) => this.setState({'commentContent': e.target.value})}/>
                  <InputGroup.Text className='PostCommentBtn' onClick={() => {this.postComment()} }>
                      <FontAwesomeIcon icon={faComment} />
                  </InputGroup.Text>
              </InputGroup>
                {this.state.postComments.comments.result ?
                    this.state.postComments.comments.result.recordset.map((postComment) => {
                      return (
                        <PostCommentComponent postData = {postComment}/>
                      )})
                    :
                    ""
                }
            </div>
          </Card>
          </div>
        :
          <div className='d-flex justify-content-center'>
            <div class="spinner-border text-primary loadingSpinnerWrapper" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
        }
      </div>
    )
  }
}
