import React, { useState, useEffect } from 'react'
import '../styles/Evaluable.css'

import useEvaluable from '../hooks/useEvaluable'
import EvaluableComponent from './EvaluableComponent'

function ComparatorComponent(props) {
    const evalHook = props.evaluable
    const evalPojo = evalHook.evaluablePojo
    const [isEditing, setIsEditing] = useState(props.isEditing)

    useEffect(() => {
        setIsEditing(props.isEditing)
    }, [props.isEditing])

    function showError() {
        window.alert(evalPojo.errordetail)
    }


    if (!evalPojo) return null

    let label
    if (evalPojo.comparator.op == "equalTo") {
        label = "Equal To"
    } else if (evalPojo.comparator.op == "lessThan") {
        label = "Less Than"
    } else if (evalPojo.comparator.op == "greaterThan") {
        label = "Greater Than"
    }

    let editingIcons = null
    if (isEditing) {
        editingIcons = (
            <div className="evaluable-icons">
                <i className="fa fa-trash-o" onClick={evalHook.setEmpty}>del</i>
                {evalPojo.error ? <i className="fa fa-exclamation-triangle" onClick={showError}>err</i> : null}
            </div>
        )
    }

    return (
        <div className="evaluable-container">
            <div className="eval-comparator-param1">
                <EvaluableComponent evaluable={evalPojo.comparator.param1} isEditing={isEditing}/>
            </div>
            <span className="eval-op-label comparator">{label}{editingIcons}</span>
            <div className="eval-comparator-param2">
                <EvaluableComponent evaluable={evalPojo.comparator.param2} isEditing={isEditing}/>
            </div>
        </div>
    )
}

export default ComparatorComponent