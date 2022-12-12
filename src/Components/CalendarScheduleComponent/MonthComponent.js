import React, { Component } from 'react'
import WeekComponent from './WeekComponent'
import WeekdaysComponent from './WeekdaysComponent'

export default class MonthComponent extends Component {
  render() {
    return (
      <div className='MonthComponentWrapper'>
        <WeekdaysComponent/>
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
