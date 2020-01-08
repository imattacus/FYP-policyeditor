import React, {useState, useEffect} from 'react'
import { useDrop } from 'react-dnd'
import '../styles/Evaluable.css'

import useEvaluable from '../hooks/useEvaluable'

function ActionTypeComponent(props) {
    const evalHook = props.evaluable
    const evalPojo = evalHook.evaluablePojo
    
    const [{ isHovering }, drop] = useDrop({
        accept: "Action",
        drop(item, monitor) {
            if (!props.isEditing) return
            const didDrop = monitor.didDrop()
            handleDrop(item.options)
        },
        collect: monitor => ({
            isHovering: monitor.isOver({shallow:true})
        })
    })

    function showError() {
        window.alert(evalPojo.errordetail)
    }


    function handleDrop(options) {
        evalHook.setAction(options.type)
    }

    if (!evalPojo) return null

    let content = (<div ref={drop} className={`empty-placeholder ${isHovering ? "hover" : ""}`}>
        <span className="eval-detail-label">You must put an action here!</span>
    </div>)
    if (evalPojo.action != null) {
        content = <span ref={drop} className={`eval-detail-label ${isHovering ? "hover" : ""}`}>{evalPojo.action}</span>
    }

    let editingIcons = null
    if (props.isEditing) {
        editingIcons = (
            <div className="evaluable-icons">
                <i className="fa fa-trash-o" onClick={evalHook.setEmpty}>del</i>
                {evalPojo.error ? <i className="fa fa-exclamation-triangle" onClick={showError}>err</i> : null}
            </div>
        )
    }

    return (
        <div className="evaluable-container">
            <span className="eval-op-label">Action Type {editingIcons}</span>
            {content}
        </div>
    )
}

export default ActionTypeComponent