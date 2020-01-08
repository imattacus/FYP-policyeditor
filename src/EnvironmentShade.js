import React, { useState, useEffect, useContext, useRef } from 'react'

import './styles/ControlPanel.css'

import ShadeHeader from './ShadeHeader'
import PolicyEditorContext from './hooks/PolicyEditorContext'

function EnvironmentShade(props) {
    const context = useContext(PolicyEditorContext)
    // const [timeValue, setTimeValue] = useState(props.timeValue)
    // const [dateValue, setDateValue] = useState(props.dateValue)
    const [isOpen, setIsOpen] = useState(false)

    let shadeContent = null
    if(isOpen) {
        shadeContent = (
        <div className="shade-content">
            <label htmlFor="dateEntry">Date</label>
            <input id="dateEntry" value={props.date} onChange={e => props.setDate(e.target.value)}></input>
            <label htmlFor="timeEntry">Time</label>
            <input id="timeEntry" value={props.time} onChange={e => props.setTime(e.target.value)}></input>
        </div>
        )
        
    }

    return (
        <div className={isOpen ? "shade shade-open" : "shade shade-closed"}>
            <ShadeHeader title={`Environment Attributes`} onCollapse={setIsOpen} isOpen={isOpen}/>
            {shadeContent}
        </div>
    )
}

export default EnvironmentShade