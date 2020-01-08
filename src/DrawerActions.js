import React, { useRef, useState } from 'react'
import { useDrag } from 'react-dnd'
import './styles/Evaluable.css'
import './styles/ControlPanel.css'

import * as Constants from './constants/'
import DraggableEvaluable from './evaluablecomponents/DraggableEvaluable'

function DrawerActions(props) {
    const actions = useRef(Constants.DRAGGABLE_ACTIONS)

    return (
        <div className="drawer-section">
            <div className="drawer-section-contents">
                {actions.current.map(action => {
                    return <DraggableEvaluable name={action.name} type={action.type} options={action.options} />
                })}
            </div>
        </div>
    )
}

export default DrawerActions