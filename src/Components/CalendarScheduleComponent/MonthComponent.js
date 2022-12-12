import React, { Component } from 'react'
import WeekComponent from './WeekComponent'

export default class MonthComponent extends Component {
  render() {
    return (
      <div className='MonthComponentWrapper'>
        <div className='MonthComponentContainerFirstWeek week row'>
          <WeekComponent weekData = {{'daysAmount': 7, 'startingDay': 1}}/>
        </div>
        <div className='MonthComponentContainerFirstWeek week row'>
          <WeekComponent weekData = {{'daysAmount': 7, 'startingDay': 7}}/>
        </div>
        <div className='MonthComponentContainerFirstWeek week row'>
          <WeekComponent weekData = {{'daysAmount': 7, 'startingDay': 14}}/>
        </div>
        <div className='MonthComponentContainerFirstWeek week row'>
          <WeekComponent weekData = {{'daysAmount': 7,'startingDay': 21}}/>
        </div>
        <div className='MonthComponentContainerFirstWeek week row'>
          <WeekComponent weekData = {{'daysAmount': 7, 'startingDay': 28}}/>
        </div>
      </div>
    )
  }
}
