import React, { Component } from 'react'
import { faCaretLeft, faCaretRight} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
export default class YearSelector extends Component {

    constructor()
    {
        super()
        this.state = {currentYear: 0}
    }
    componentDidMount(){
        this.setState({'currentYear' : this.props.yearData.currentYear})
    }
    goYearBack = () => {
        let previousYear = this.state.currentYear - 1
        this.setState({'currentYear' : previousYear })
    }
    goYearForward = () => {
        let NextYear = this.state.currentYear + 1
        this.setState({'currentYear' : NextYear })
    }
  render() {
      return (
          <div className='MonthSelectorWrapper'>
            <FontAwesomeIcon icon = {faCaretLeft} className = 'CaretLeft caret' onClick={() => this.goYearBack()}/>
            <input type='text' className='form-control MonthSelector' disabled placeholder={this.state.currentYear}/>
            <FontAwesomeIcon icon = {faCaretRight} className = 'CaretLeft caret' onClick={() => this.goYearForward()}/>
        </div>
    )
    
  }
}
