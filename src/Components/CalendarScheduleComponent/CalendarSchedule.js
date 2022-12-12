import React, { Component } from 'react'
import MonthComponent from './MonthComponent'
import MonthSelector from './MonthSelector'
import { getFirstDayOfMonth } from './utils'
import YearSelector from './YearSelector'

export default class CalendarSchedule extends Component {
  constructor()
  {
    super()
    this.firstDayOfMonth = getFirstDayOfMonth( new Date().getUTCFullYear(), new Date().getMonth()).toString().split(' ')[0]    
  }
  render() {
    return (
      <div className='CalendarWrapper'>
        <div className='CalendarContainer mx-auto'>
            {console.log(new Date().getDay())}
            <YearSelector yearData = {{currentYear: new Date().getUTCFullYear()}}/>
            <MonthSelector monthData = {{currentMonth: new Date().getMonth(), firstDayOfMonth: this.firstDayOfMonth}}/>
            <MonthComponent/>
        </div>
      </div>
    )
  }
}

