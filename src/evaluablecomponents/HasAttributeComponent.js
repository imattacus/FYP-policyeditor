import React from 'react'
import { useDrop } from 'react-dnd'
import '../styles/Evaluable.css'


function HasAttributeComponent(props) {
    const evalHook = props.evaluable
    const evalPojo = evalHook.evaluablePojo
    const [{ isHovering }, drop] = useDrop({
        accept: "Attribute",
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

    function handleDrop(attr) {
        evalHook.setAttribute(attr)
    }

    if (!evalPojo) return null

    let label 
    if (evalPojo.op == "subjectHasAttribute") {
        label = "Subject Has Attribute"
    } else if (evalPojo.op == "resourceHasAttribute") {
        label = "Resource Has Attribute"
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

    let content = (<div ref={drop} className={`empty-placeholder ${isHovering ? "hover" : ""}`}>
        <span className="eval-detail-label">You must put an attribute here!</span>
    </div>)
    if (evalPojo.attribute != null) {
        content = <span ref={drop} className={`eval-detail-label ${isHovering ? "hover" : ""}`}>{evalPojo.attribute.attribute_id}</span>
    }

    return (
        <div className="evaluable-container">
            <span className="eval-op-label">{label}{editingIcons}</span>
            {content}
        </div>
    )
}

export default HasAttributeComponent