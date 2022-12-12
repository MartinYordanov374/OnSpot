import React, { Component } from 'react'
import { faCaretLeft, faCaretRight} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
export default class MonthSelector extends Component {
  render() {
    return (
        <div className='MonthSelectorWrapper'>
            <FontAwesomeIcon icon = {faCaretLeft} className = 'CaretLeft caret'/>
            <input type='text' className='form-control' disabled/>
            <FontAwesomeIcon icon = {faCaretRight} className = 'CaretLeft caret'/>

        </div>
    )
  }
}
