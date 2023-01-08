import React, { Component } from 'react'
import { Container, Card, Button } from 'react-bootstrap'
import Axios from 'axios'
import './Styles/SquareEventCardStyles.css'
import { Buffer } from 'buffer';
import { faLock, faLockOpen, faChartLine, faMicrochip, faComment, faBullhorn, faStar, faPersonWalkingArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default class SquareEventCardComponent extends Component {
  render() {
    let eventData = this.props;
    console.log(eventData)
    return (
        <Card className='EventCard col-lg-5 col-md-8 col-sm-8' >

            <Card.Body className='EventCardBody'>
                <Card.Link href={`/Event/${eventData.props.EventID}`}>
                    <Card.Img
                        className='EventCardImage'
                        src={`https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fedgewood.org%2Fwp-content%2Fuploads%2F2020%2F08%2FiStock-1172741523-scaled.jpg&f=1&nofb=1&ipt=a4878aef5df609e9ad98d20d4a6bc68b145813865386519dbcb42199c651669c&ipo=images`}
                    />
                    <Card.Title className='EventCardTitle'>
                        {eventData.props.EventName}
                    </Card.Title>
                    <Card.Subtitle className='EventCardDate'>
                        <span>{eventData.props.EventStartDate.split('T')[0].split('-').join('/')} - {eventData.props.EventEndDate.split('T')[0].split('-').join('/')}</span>
                    </Card.Subtitle>

                    <div className='EventDetailsContainer row'>

                        <Card.Text className='EventType col-lg-5'>
                            {eventData.props.EventType == 1 ? <FontAwesomeIcon icon={faLock}/> : <FontAwesomeIcon icon={faLockOpen}/>}
                            {eventData.props.EventType == 1 ? 'Private' : 'Public'}
                        </Card.Text>
                        <Card.Text className='EventClass col-lg-4'>
                            {eventData.props.EventClass == 'Business' ? <FontAwesomeIcon icon={faChartLine}/> : ""}
                            {eventData.props.EventClass == 'Tech' ? <FontAwesomeIcon icon={faMicrochip}/> : ""}
                            {eventData.props.EventClass == 'Hangout' ? <FontAwesomeIcon icon={faComment}/> : ""}
                            {eventData.props.EventClass == 'Other' ? <FontAwesomeIcon icon={faBullhorn}/> : ""}

                            {eventData.props.EventClass}
                        </Card.Text>
                    </div>
                </Card.Link>
                    {/* <div className='EventInteractionButtons'>
                        <Button className='GoingButton Button'> 
                            <FontAwesomeIcon icon={faPersonWalkingArrowRight}/> Going
                        </Button>

                    </div> */}

            </Card.Body>
        </Card>
    )
  }
}
