import React, { Component } from 'react'
import DayComponent from './DayComponent'

export default class CalendarSchedule extends Component {
  render() {
    return (
      <div>
        <DayComponent dayData = {{'dayNumber': 7}}/>
      </div>
    )
  }
}
