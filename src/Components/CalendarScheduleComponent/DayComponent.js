import React, { Component } from 'react'
import './Styles/CalendarScheduleStyle.css'
export default class DayComponent extends Component {
  
  render() {
    return (
      <div className='DayComponentWrapper'>
        <div className='DayContainer'>
              <span className='DayNumber'>{this.props.dayData.dayNumber}</span>
        </div>
      </div>
    )
  }
}
