import React from 'react'
import { useDrag } from 'react-dnd'
import '../styles/Evaluable.css'
import '../styles/ControlPanel.css'

function DraggableComponent(props) {
    const [, drag] = useDrag({
        item: {
            type: props.type,
            options: props.options
        }})

    return (
        <div ref={drag} className="draggable-component">
            {props.name}
        </div>
    )
}

export default DraggableComponent