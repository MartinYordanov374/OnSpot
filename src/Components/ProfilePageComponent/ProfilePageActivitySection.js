import React, { Component } from 'react'
import PostComponent from '../PostComponent/PostComponent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Container, Button,Card, Dropdown, FormControl, InputGroup } from 'react-bootstrap'
import { faEllipsis, faGripHorizontal, faListDots, faSlash, faUserLargeSlash, faUsersLine, faComment, faImage } from '@fortawesome/free-solid-svg-icons';
import * as io from 'socket.io-client'
import Axios from 'axios'

export default class ProfilePageActivitySection extends Component {
    constructor()
    {
        super()
        this.state = {
            socket: io.connect('http://localhost:3030/'),
            commentContent: ''
        }
    }
    postComment = async() => {
        try
        {
          let targetPostID = this.props.postData.PostID[0]
          let commentContent = this.props.props.commentContent
          let formData = new FormData()
          formData.append('targetPostID', targetPostID)
          formData.append('PostContent', commentContent)
          for(let image of this.props.props.postImages)
          {
            formData.append('postImage', image)
          }
           let result = await Axios.post(`http://localhost:3030/createPost`, formData,
           {
            withCredentials: true, 
            headers: {
            'Content-Type': 'multipart/form-data'
            }
          })  
           .then((res) => {
             this.setState({'commentContent': ''})
             this.props.props.getUserDataFunction()
           })
        }
        catch(err)
        {
          
            let targetPostID = null
            let commentContent = this.state.commentContent
            let formData = new FormData()
            formData.append('targetPostID', targetPostID)
            formData.append('PostContent', commentContent)
  
            for(let image of this.props.props.postImages)
            {
              formData.append('postImage', image)
            }
             let result = await Axios.post(`http://localhost:3030/createPost`, formData,
             {
              withCredentials: true, 
              headers: {
              'Content-Type': 'multipart/form-data'
              }
            })
             .then((res) => {
               this.setState({'commentContent': ''})
               this.props.props.getUserDataFunction()
  
               this.state.socket.emit('notify', {
                notificationData: {senderID: this.props.props.currentUserData.id},
                isMessage: false,
                isPost: true,
                isFollower: false,
                isComment: false
              })
  
             })
          
        }
      }

      shouldComponentUpdate (nextProps) {
        // Rendering the component only if
        // passed props value is changed
    
        if (nextProps !== this.props.props) {
          return true;
        } else {
          return false;
        }
    }
    render() {
    return (
        <div className={this.props.props.allPostsData.length > 0 ? 'userEvents' : 'userEvents NoEvents'}>
        {this.props.props.isCurrentUserOwner == false 
          ? 
                <Dropdown>
                  <Dropdown.Toggle className='moreOptionsButton btn-light'>
                        <FontAwesomeIcon icon={faEllipsis}/>
                  </Dropdown.Toggle>
            
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => this.blockUser()}>
                      <FontAwesomeIcon icon = {faUserLargeSlash} />Block User
                    </Dropdown.Item>
                  </Dropdown.Menu>
              </Dropdown>
          :
          ""
        }
          {/* I should probably include what the user attended as well?? */}
          {this.props.props.isCurrentUserOwner ?
          <div>
            <InputGroup className='writeCommenttWrapper'>
              <FormControl 
                placeholder='Write a post...' 
                className='commentInputField shadow-none' 
                value = {this.state.commentContent}
                onChange={(e) => this.setState({'commentContent': e.target.value})}
              />
              <input type="file" className="postImagesUploadField" hidden  multiple="multiple" onChange={() => this.props.props.uploadPostImages()}/>
                <InputGroup.Text className='PostCommentBtn' onClick={() => this.props.props.handleSelectPostImages()}>
                  <FontAwesomeIcon icon={faImage} />
                </InputGroup.Text>
              <InputGroup.Text className='PostCommentBtn' onClick={() => {this.postComment()} }>
                  <FontAwesomeIcon icon={faComment} />
              </InputGroup.Text>
            </InputGroup>
          </div>
          :
          ""
          }
          <h2 className='userActivityHeader'>Latest Activity</h2>
          {this.props.props.allPostsData.length > 0 ? 
          <div className='EventsActivity'>
            
           {this.props.props.allPostsData.map((post) => {
            let PostImages = this.props.props.userPostsImages.filter((postImage) => postImage.PostID == post.PostID)
            if(post.SharerID != undefined)
              {
                return (
                  <PostComponent postImages = {PostImages} postData = {post} dataHandler = {this.props.props.getUserDataFunction} editPost={this.editPost} editModal = {this.props.props.isModalShown} isShared = {true}/>
                )
              }
              else
              {
                return (
                  <PostComponent postImages = {PostImages} postData = {post} dataHandler = {this.props.props.getUserDataFunction} editPost={this.editPost} editModal = {this.props.props.isModalShown} isShared = {false}/>
                )
              }
           })}
          </div>  
          :
            <div className='NoActivityMessageWrapper'>
              <p className='NoActivityMessage'>This user has not spotted anything lately.</p>
            </div>
          }
      </div>
    )
  }
}
