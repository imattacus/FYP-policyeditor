import React, {useState, useEffect} from 'react'
import '../styles/Evaluable.css'

import useEvaluable from '../hooks/useEvaluable'
import EvaluableComponent from './EvaluableComponent'

function CombinatorComponent(props) {
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

    if (evalPojo.op != 'combinator') {
        let evaluable = evalHook.evaluableObj
        return <EvaluableComponent evaluable={evaluable} isEditing={props.isEditing} />
    }

    let label
    if (evalPojo.combinator.op == "allOf") {
        label = "All Of"
    } else if (evalPojo.combinator.op == "anyOf") {
        label = "Any Of"
    }

    let editingIcons = null
    if (isEditing) {
        editingIcons = (
            <div className="evaluable-icons">
                <i className="fa fa-plus" onClick={evalHook.combinatorAdd}>add</i>
                <i className="fa fa-trash-o" onClick={evalHook.setEmpty}>del</i>
                {evalPojo.error ? <i className="fa fa-exclamation-triangle" onClick={showError}>err</i> : null}
            </div>
        )
    }

    return (
        <div className="evaluable-container">
            <span className="eval-op-label combinator">{label}{editingIcons}</span>
            
            {evalPojo.combinator.children.map((child) => {
                return (<div className="eval-combinator-child">
                    <EvaluableComponent evaluable={child} isEditing={isEditing}/>
                </div>)
            })}
        </div>
    )
}

export default CombinatorComponent