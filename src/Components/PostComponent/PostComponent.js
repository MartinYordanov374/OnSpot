import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faCommentAlt, faShare, faShareAlt, faShareAltSquare, faShareFromSquare, faShareNodes, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { Container, Button,Card, } from 'react-bootstrap'
import Axios from 'axios'

export default class PostComponent extends Component {

  constructor()
  {
    super()
    this.state = {
      postOwnerData: null
    }
  }
  getPosterData = async(userID) => {
    await Axios.post(`http://localhost:3030/getUserDataById/${userID}`, {}, {withCredentials: true})
    .then((res) => {
      console.log(res)
      this.setState({'postOwnerData': res.data})
    })
  }

  componentDidMount = () => {
    this.getPosterData(this.props.postData.UserID)
  }
  render() {
    return (
    <Card className='eventPost'>
        <Card.Header>test</Card.Header>
        <Card.Body>
          <Card.Text>
            {this.props.postData.PostContent}
          </Card.Text>
        </Card.Body>
        <Card.Footer className='postInteractionButtons'>
          <div className='row'>
            <span className='col-sm-4 interactionButton'>
              <FontAwesomeIcon icon={faThumbsUp}/> Like
            </span>
            <span className='col-sm-4 interactionButton'>
              <FontAwesomeIcon icon={faCommentAlt}/> Comment
            </span>
            <span className='col-sm-4 interactionButton'>
              <FontAwesomeIcon icon={faShare}/> Share
            </span>
          </div>
        </Card.Footer>
      </Card>
    )
  }
}
