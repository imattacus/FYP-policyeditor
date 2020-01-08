import React, { useState, useContext } from 'react'
import { useDrop } from 'react-dnd'
import '../styles/Evaluable.css'

import useEvaluable from '../hooks/useEvaluable'
import EvaluableComponent from './EvaluableComponent'

import PolicyEditorContext from '../hooks/PolicyEditorContext'

function EmptyComponent(props) {
    const context = useContext(PolicyEditorContext)
    const evalHook = props.evaluable

    const [{ isHovering }, drop] = useDrop({
        accept: "Evaluable",
        drop(item, monitor) {
            if (!props.isEditing) return
            const didDrop = monitor.didDrop()
            handleDrop(item.options.op, item.options.comOp)
        },
        collect: monitor => ({
            isHovering: monitor.isOver()
        })
    })

    if (evalHook.evaluablePojo.op != 'empty') {
        let evaluable = evalHook.evaluableObj
        return <EvaluableComponent evaluable={evaluable} isEditing={props.isEditing}/>
    }

    // Dropping an evaluable on to Empty should replace it
    function handleDrop(op, comOp) {
        evalHook.setOp(op, comOp)
    }


    return (
        <div ref={drop} className={`evaluable-container ${isHovering ? 'hover' : ''}`}>
            <span className="eval-op-label">Empty</span>
            <span className="eval-detail-label">(Always true)</span>
        </div>
    )
}

export default EmptyComponent