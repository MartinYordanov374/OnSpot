import React from 'react'
import { Container,Card } from 'react-bootstrap'
import { faThumbsDown, faThumbsUp, faCommentAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import './CommentComponentStyles/CommentComponentStyle.css'
export default function CommentComponent() {
  return (
    <Container>
        <Card className='comment'>
            <Card.Header className='commentHeader'>

                <div className='commentOwnerInfo d-flex'>
                    <img className = 'commentOwnerPFP' src='https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.pinimg.com%2F736x%2F8b%2F16%2F7a%2F8b167af653c2399dd93b952a48740620.jpg&f=1&nofb=1&ipt=33608bf0973b950d8a9032fd47b796c156c60bf3f6edf4b174dc2947f2d9b4da&ipo=images'/>
                    <Card.Title className='col commentOwnerNickname'>CommentOwner</Card.Title>
                </div>
            </Card.Header>
            <Card.Body>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </Card.Body>
            <Card.Footer className='commentFooter'>
                <div className='row InteractionButtonsWrapper'>
                    <span className='col btn LikeButton'> <FontAwesomeIcon icon={faThumbsUp}/> Like</span>
                    <span className='col btn DislikeButton'> <FontAwesomeIcon icon={faThumbsDown}/> Dislike</span>
                </div>
            </Card.Footer>
        </Card>

    </Container>
  )
}
