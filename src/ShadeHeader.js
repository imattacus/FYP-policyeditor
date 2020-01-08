import React, { useState, useEffect } from 'react'
import './styles/ControlPanel.css'

// This component only exists when a component is selected, can be closed with an x arrow which deselects the component
function ShadeHeader(props) {
    const [isOpen, setIsOpen] = useState(props.isOpen)


    function handleCollapse() {
        let tmpIsOpen = !isOpen
        setIsOpen(tmpIsOpen)
        props.onCollapse(tmpIsOpen)
    }

    return (
        <div className="shade-header">
            <span className="title">{props.title}</span>
            <div className="shade-controls">
                {props.editable ? props.isEditing ? <i className="fa fa-floppy-o" onClick={() => props.onSave()}></i> : <i id="edit" class="fa fa-pencil" onClick={()=>props.onEdit(true)}></i> : null}
                <i id="collapse" class={isOpen ? "fa fa-caret-down" : "fa fa-caret-left"} onClick={handleCollapse}></i>
                {props.removeable ? <i id="close" class="fa fa-times-circle" onClick={props.onRemove}></i> : null}
            </div>
        </div>
    )
}

export default ShadeHeader