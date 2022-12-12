import React, { Component } from 'react'
import DayComponent from './DayComponent'

export default class WeekComponent extends Component {
  render() {
    return (
      <div className='weekWrapper'>
        <div className='weekContainer row'>
            <DayComponent  dayData = {{'dayNumber': 1, 'dayName': 'MON'}}/>
            <DayComponent dayData = {{'dayNumber': 2, 'dayName': 'TUE'}}/>
            <DayComponent className ='col' dayData = {{'dayNumber': 3, 'dayName': 'WED'}}/>
            <DayComponent className ='col' dayData = {{'dayNumber': 4, 'dayName': 'THU'}}/>
            <DayComponent className ='col' dayData = {{'dayNumber': 5, 'dayName': 'FRI'}}/>
            <DayComponent className ='col' dayData = {{'dayNumber': 6, 'dayName': 'SAT'}}/>
            <DayComponent className ='col' dayData = {{'dayNumber': 7, 'dayName': 'SUN'}}/>
        </div>
      </div>
    )
  }
}
