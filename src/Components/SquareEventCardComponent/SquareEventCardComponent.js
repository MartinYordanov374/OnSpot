import React, { Component } from 'react'
import { Container, Card, Button } from 'react-bootstrap'
import Axios from 'axios'
import './Styles/SquareEventCardStyles.css'
import { Buffer } from 'buffer';
import { faLock, faLockOpen, faChartLine, faMicrochip, faComment, faBullhorn } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default class SquareEventCardComponent extends Component {
  render() {
    let eventData = this.props;
    return (
    //   <div className='EventCardWrapper'>
        <Card className='EventCard col-lg-5 col-md-9 col-sm-9' >

            <Card.Body className='EventCardBody'>
                <Card.Img
                    className='EventCardImage'
                    src={`https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fedgewood.org%2Fwp-content%2Fuploads%2F2020%2F08%2FiStock-1172741523-scaled.jpg&f=1&nofb=1&ipt=a4878aef5df609e9ad98d20d4a6bc68b145813865386519dbcb42199c651669c&ipo=images`}
                />
                <Card.Title className='EventCardTitle'>
                    {eventData.props.EventName}
                </Card.Title>
                <Card.Subtitle className='EventCardDate'>
                    Jan 22 2023 - Jan 23 2023
                </Card.Subtitle>
                <div className='EventDetailsContainer row'>
                    <Card.Text className='EventClass col-lg-4'>
                        {eventData.props.EventClass == 'Business' ? <FontAwesomeIcon icon={faChartLine}/> : ""}
                        {eventData.props.EventClass == 'Tech' ? <FontAwesomeIcon icon={faMicrochip}/> : ""}
                        {eventData.props.EventClass == 'Hangout' ? <FontAwesomeIcon icon={faComment}/> : ""}
                        {eventData.props.EventClass == 'Other' ? <FontAwesomeIcon icon={faBullhorn}/> : ""}

                        {eventData.props.EventClass}
                    </Card.Text>
                    <Card.Text className='EventType col-lg-5'>
                        {eventData.props.EventType == 1 ? <FontAwesomeIcon icon={faLock}/> : <FontAwesomeIcon icon={faLockOpen}/>}
                        {eventData.props.EventType == 1 ? 'Private' : 'Public'}
                    </Card.Text>
                </div>
                {/* <Card.Text  className='EventCardDescription'>
                    {eventData.props.EventDescription.length > 17 ? eventData.props.EventDescription.slice(0, 17) + '...' : eventData.props.EventDescription}
                </Card.Text> */}
                <div className='EventInteractionButtons'>
                    <Button className='LearnMoreButton'>Learn More</Button>
                </div>

            </Card.Body>
        </Card>
    //   </div>
    )
  }
}
