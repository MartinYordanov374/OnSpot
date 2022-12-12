import React, { Component } from 'react'
import './Styles/CalendarScheduleStyle.css'

export default class WeekdaysComponent extends Component {
  render() {
    return (
      <div>
        <div className='weekdaysContainer row'>
          <div className='weekdayContainer col'>
            <p>MON</p>
          </div>
          <div className='weekdayContainer col'>
            <p>TUE</p>
          </div>
          <div className='weekdayContainer col'>
            <p>WED</p>
          </div>
          <div className='weekdayContainer col'>
            <p>THU</p>
          </div>
          <div className='weekdayContainer col'>
            <p>FRI</p>
          </div>
          <div className='weekdayContainer col'>
            <p>SAT</p>
          </div>
          <div className='weekdayContainer col'>
            <p>SUN</p>
          </div>
        </div>
      </div>
    )
  }
}
