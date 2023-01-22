import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faCommentAlt, faShare, faShareAlt, faShareAltSquare, faShareFromSquare, faShareNodes, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { Container, Button,Card, } from 'react-bootstrap'
import Axios from 'axios'
import './PostCommentStyles/Styles.css'
import { Buffer } from 'buffer';

export default class PostCommentComponent extends Component {

  constructor()
  {
    super()
    this.state = {
      postOwnerData: null,
      isLoading: true,
      postComments: []
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

  getPostComments = async(postID) => {
    await Axios.get(`http://localhost:3030/getPostComments/${postID}`, {}, {withCredentials: true})
    .then((res) => {
      this.setState({'postComments': res.data})
    })
  }

  componentDidMount = () => {
    this.getPosterData(this.props.postData.UserID)
    this.getPostComments(this.props.postData.PostID)

  }
  render() {
    return (
      <div>
        {this.state.isLoading == false ?
          <Card className='commentWrapper'>
            <Card.Header className='commentHeader'>
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
                <span className='commenterUsername'> {this.state.postOwnerData.Username}</span>
              :
                ""
              }
            </Card.Header>
            <Card.Body>
              <Card.Text>
                {this.props.postData.PostContent}
              </Card.Text>
            </Card.Body>
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
