import React, { Component } from 'react'
import DayComponent from './DayComponent'

export default class WeekComponent extends Component {

  render() {
    return (
      <div className='weekWrapper'>
        <div className='weekContainer row'>
          {
            [...Array(this.props.weekData.daysAmount)].slice(0,Array(this.props.weekData.daysAmount).length - 1).map((day, index) => {
              return(
                <DayComponent  dayData = {{'dayNumber': (index) + this.props.weekData.startingDay}}/>
              )
            })
          }
        </div>
      </div>
    )
  }
}
