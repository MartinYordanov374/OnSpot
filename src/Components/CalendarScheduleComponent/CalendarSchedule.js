import React, { Component } from 'react'
import DayComponent from './DayComponent'
import WeekComponent from './WeekComponent'

export default class CalendarSchedule extends Component {
  render() {
    return (
      <div className='CalendarWrapper'>
        <div className='CalendarContainer mx-auto'>
            <WeekComponent/>
        </div>
      </div>
    )
  }
}
