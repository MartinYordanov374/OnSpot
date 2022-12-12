import React, { Component } from 'react'
import './Styles/CalendarScheduleStyle.css'
export default class DayComponent extends Component {
  
  render() {
    return (
        <div className='DayContainer col'>
              <p className='DayNumber DayText'>{this.props.dayData.dayNumber}</p>
              <p className='DayName DayText'>{this.props.dayData.dayName}</p>
        </div>
    )
  }
}
