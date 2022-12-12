import React, { Component } from 'react'
import MonthComponent from './MonthComponent'
import MonthSelector from './MonthSelector'

export default class CalendarSchedule extends Component {
  render() {
    return (
      <div className='CalendarWrapper'>
        <div className='CalendarContainer mx-auto'>
            <MonthSelector/>
            <MonthComponent/>
        </div>
      </div>
    )
  }
}
