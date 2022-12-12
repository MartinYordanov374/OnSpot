import React, { Component } from 'react'
import MonthComponent from './MonthComponent'
import MonthSelector from './MonthSelector'
import YearSelector from './YearSelector'

export default class CalendarSchedule extends Component {
  render() {
    return (
      <div className='CalendarWrapper'>
        <div className='CalendarContainer mx-auto'>
            <YearSelector yearData = {{currentYear: new Date().getUTCFullYear()}}/>
            <MonthSelector monthData = {{currentMonth: new Date().getMonth()}}/>
            <MonthComponent/>
        </div>
      </div>
    )
  }
}
