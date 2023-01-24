import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faCommentAlt, faShare, faThumbsUp, faEllipsis, faTrash, faPen } from "@fortawesome/free-solid-svg-icons";
import { Container, Button,Card, FormControl, InputGroup, Dropdown } from 'react-bootstrap'
import Axios from 'axios'
import './Styles/PostStyles.css'
import { Buffer } from 'buffer';
import PostCommentComponent from '../PostCommentComponent/PostCommenComponentt';

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
      currentUserData: null,
      postLikesAmount: 0,
      postLikers: [],
      hasUserLikedThisPost: false
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
    }
  }

  postComment = async() => {
    let targetPostID = this.props.postData.PostID[0]
    let commentContent = this.state.commentContent
    let result = await Axios.post(`http://localhost:3030/createPost`, {
      PostContent: commentContent,
      targetPostID: targetPostID
    }, {withCredentials: true})
    .then((res) => {
      this.getPostComments(this.props.postData.PostID[0])
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
    })
    .catch((err) => {
      console.log(err)
    })
  }

  deletePost = async() => {
    await Axios.delete(`http://localhost:3030/DeletePost/${this.props.postData.PostID[0]}`)
    .then((res) => {
      this.props.dataHandler()

    })
  }  

  componentDidMount = () => {
    this.getCurrentUserData()
    this.getPosterData(this.props.postData.UserID)
    this.getPostComments(this.props.postData.PostID[0])
    this.getPostLikes(this.props.postData.PostID[0])
    this.hasUserLikedThisPost(this.props.postData.PostID[0])
  }


  render() {
    return (
      <div>
        {this.state.isLoading == false ?
        
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
                <Dropdown.Toggle className='moreOptionsButton btn-light'>
                      <FontAwesomeIcon icon={faEllipsis}/>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => this.deletePost()}>
                    <FontAwesomeIcon icon={faTrash}/> Delete post
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              :
              ""}
            </Card.Header>
            <Card.Body>
              <Card.Text>
                {this.props.postData.PostContent}
              </Card.Text>
            </Card.Body>
            {this.state.postLikesAmount > 0 ?
              <span className='likesIndicator'>{this.state.postLikesAmount} people like this</span>
            : 
            ""}
            <Card.Footer className='postInteractionButtons'>
              <div className='row'>
                {this.state.hasUserLikedThisPost == false ?
                  <span className='col-sm-4 interactionButton'>
                    <FontAwesomeIcon icon={faThumbsUp}/> Like
                  </span>
                :
                  <span className='col-sm-4 interactionButton'>
                    <FontAwesomeIcon icon={faThumbsUp}/> Unlike
                  </span>
                }
                <span className='col-sm-4 interactionButton' onClick={()=> this.showComments()}>
                  <FontAwesomeIcon icon={faCommentAlt}/> Comments
                </span>
                <span className='col-sm-4 interactionButton'>
                  <FontAwesomeIcon icon={faShare}/> Share
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
