import React, { Component } from 'react'
import { faCaretLeft, faCaretRight} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
export default class MonthSelector extends Component {

    constructor()
    {
        super()
        this.state = {currentMonth: 0}
        this.months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    }
    componentDidMount(){
        this.setState({'currentMonth' : this.props.monthData.currentMonth})
    }
    goMonthBack = () => {
        let previousMonth = this.state.currentMonth - 1
        console.log(previousMonth)
        if(previousMonth < 0)
        {
            previousMonth = 11
        }
        this.setState({'currentMonth' : previousMonth })
    }
    goMonthForward = () => {
        let NextMonth = this.state.currentMonth + 1
        console.log(NextMonth)
        if(NextMonth > 11)
        {
            NextMonth = 0
        }
        this.setState({'currentMonth' : NextMonth })
    }
  render() {
      return (
          <div className='MonthSelectorWrapper'>
            <FontAwesomeIcon icon = {faCaretLeft} className = 'CaretLeft caret' onClick={() => this.goMonthBack()}/>
            <input type='text' className='form-control MonthSelector' disabled placeholder={this.months[this.state.currentMonth]}/>
            <FontAwesomeIcon icon = {faCaretRight} className = 'CaretLeft caret' onClick={() => this.goMonthForward()}/>
        </div>
    )
    
  }
}
