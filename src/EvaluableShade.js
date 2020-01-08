import React, { useState, useContext, useRef } from 'react'
import './styles/ControlPanel.css'
import './styles/Evaluable.css'

import Evaluable from './accesscontrol/syntax/Evaluable'

import ShadeHeader from './ShadeHeader'
import PolicyEditorContext from './hooks/PolicyEditorContext'
import EvaluableErrorContext from './hooks/EvaluableErrorContext'
import EvaluableComponent from './evaluablecomponents/EvaluableComponent'
import useEvaluable from './hooks/useEvaluable';

// function cloneEvaluable(evaluable) {
//     let newEval = new Evaluable()
//     newEval._obj_constructor(evaluable.toJson())
//     return newEval
// }

function EvaluableShade(props) {
    const context = useContext(PolicyEditorContext)
    const [isOpen, setIsOpen] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [error, setError] = useState(null)
    const savedReq = useRef(null)

    let errorContext = {
        error: error
    }

    function handleEdit(b) {
        if (b) {
            savedReq.current = context.request
            props.setDrawerOpen(true)
            context.setRequest(null)
            setIsEditing(true)
        }
    }

    function handleSave() {
        try {
            let dt = props.evaluable.validate()
            if (dt != 'boolean') {
                window.alert("Evaluable must evaluate to a boolean at the top level!")
                return
            }
            setError(null)
            setIsEditing(false)
            props.setDrawerOpen(false)
            context.setRequest(savedReq.current)
        } catch(err) {
            window.alert(err.message)
            setError(err.message)
        }
    }

    let shadeContent = (
        <EvaluableComponent evaluable={props.evaluable} isEditing={isEditing}/>
    )

    return (
        <EvaluableErrorContext.Provider value={errorContext}>
        <div className={isOpen ? "shade shade-open" : "shade shade-closed"}>
            <ShadeHeader title={props.title} editable onEdit={handleEdit} isEditing={isEditing} onCollapse={setIsOpen} isOpen={isOpen} onSave={handleSave}/>
            <div className="shade-content">
                <div className="evaluable-view">
                    {isOpen ? shadeContent : null}
                </div>
            </div>
        </div>
        </EvaluableErrorContext.Provider>
    )
}

export default EvaluableShade
