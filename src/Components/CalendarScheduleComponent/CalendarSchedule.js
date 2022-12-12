import React, { Component } from 'react'
import MonthComponent from './MonthComponent'

export default class CalendarSchedule extends Component {
  render() {
    return (
      <div className='CalendarWrapper'>
        <div className='CalendarContainer mx-auto'>
            <MonthComponent/>
        </div>
      </div>
    )
  }
}
