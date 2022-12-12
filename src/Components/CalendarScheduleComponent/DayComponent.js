import React, { Component } from 'react'
import './Styles/CalendarScheduleStyle.css'
export default class DayComponent extends Component {
  
  render() {
    return (
        <div className='DayContainer col'>
          {this.props.dayData.dayNumber <= 31 ?
              <p className='DayNumber DayText'>{this.props.dayData.dayNumber}</p>
              :
              ""
          }
        </div>
    )
  }
}
