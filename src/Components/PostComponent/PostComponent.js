import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faCommentAlt, faShare, faShareAlt, faShareAltSquare, faShareFromSquare, faShareNodes, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { Container, Button,Card, } from 'react-bootstrap'

export default class PostComponent extends Component {
  render() {
    return (
    <Card className='eventPost'>
        <Card.Header>Poster</Card.Header>
        <Card.Body>
          <Card.Text>
            Sample post text
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
