import React, { useState, useEffect } from 'react'

import useEvaluable from '../hooks/useEvaluable'

function ValueComponent(props) {
    const evalHook = props.evaluable
    const evalPojo = evalHook.evaluablePojo
    const [value, setValue] = useState(evalPojo.value)

    function keypress(e) {
        if (e.key === 'Enter') {
            console.log("enter pressed")
            evalHook.setValue(value)
        }
    }

    function handleDTChange(e) {
        evalHook.setDataType(e.target.value)
    }

    function showError() {
        window.alert(evalPojo.errordetail)
    }

    useEffect(() => {
        console.log(evalPojo.value)
    }, [evalPojo])

    if (!evalPojo) return null

    let editingIcons = null
    if (props.isEditing) {
        editingIcons = (
            <div className="evaluable-icons">
                <i className="fa fa-trash-o" onClick={evalHook.setEmpty}>del</i>
                {evalPojo.error ? <i className="fa fa-exclamation-triangle" onClick={showError}>err</i> : null}
            </div>
        )
    }

    let content = (
        <>
        <span className="eval-detail-label">{evalPojo.value}</span>
        <span className="eval-detail-label">{evalPojo.data_type}</span>
        </>
    )
    if (props.isEditing) {
        content = (
            <>
            <input placeholder="Value" value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={keypress}></input>
            <select value={evalPojo.data_type} onChange={handleDTChange}>
                <option value={'string'}>String</option>
                <option value={'boolean'}>Boolean</option>
                <option value={'integer'}>Integer</option>
            </select>
            </>
        )
    }

    return (
        <div className="evaluable-container">
            <span className="eval-op-label">Value{editingIcons}</span>
            {content}
        </div>
    )
}

export default ValueComponent