import React, { useRef, useState } from 'react'
import { useDrag } from 'react-dnd'
import './styles/Evaluable.css'
import './styles/ControlPanel.css'

import * as Constants from './constants/'
import DraggableEvaluable from './evaluablecomponents/DraggableEvaluable'

function DrawerEvaluables(props) {
    const evaluables = useRef(Constants.DRAGGABLE_EVALUABLES)

    return (
        <div className="drawer-section">
            <div className="drawer-section-contents">
                {evaluables.current.map(evaluable => {
                    return <DraggableEvaluable name={evaluable.name} type={evaluable.type} options={evaluable.options} />
                })}
            </div>
        </div>
    )
}

export default DrawerEvaluables