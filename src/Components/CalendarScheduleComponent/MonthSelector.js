import React, { Component } from 'react'
import { faCaretLeft, faCaretRight} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
export default class MonthSelector extends Component {

    constructor()
    {
        super()
        this.state = {currentMonth: 0}
        this.months = ['Jan', 'Feb', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    }
    componentDidMount(){
        this.setState({'currentMonth' : this.months[this.props.monthData.currentMonth - 1]})
    }
  render() {
      return (
          <div className='MonthSelectorWrapper'>
            <FontAwesomeIcon icon = {faCaretLeft} className = 'CaretLeft caret'/>
            <input type='text' className='form-control MonthSelector' disabled placeholder={this.state.currentMonth}/>
            <FontAwesomeIcon icon = {faCaretRight} className = 'CaretLeft caret'/>
        </div>
    )
    
  }
}
