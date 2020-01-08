import React, { useState, useEffect } from 'react'
import { Arrow } from 'react-konva' 
import * as Constants from '../constants/'

function DecisionLine(props) {
    //const [decision, setDecision] = useState(props.parentDecision)

    if (!props.decision) return null

    let parentX
    let parentY
    let childX
    let childY
    if (props.parentPosition.x != 0 && props.parentPosition.y != 0) {
        parentX = (props.parentPosition.x + (Constants.POLICY_COMPONENT_WIDTH / 2)) - 10
        parentY = props.parentPosition.y + (Constants.POLICY_COMPONENT_HEIGHT)
        childX = props.childPosition.x
        childY = (props.childPosition.y + (Constants.POLICY_COMPONENT_HEIGHT / 2)) + 10
    } else {
        parentX = props.parentPosition.x
        parentY = (props.childPosition.y + (Constants.POLICY_COMPONENT_HEIGHT / 2)) + 10
        childX = props.childPosition.x
        childY = (props.childPosition.y + (Constants.POLICY_COMPONENT_HEIGHT / 2)) + 10
    }

    let color = props.decision.Decision == "Permit" ? "green" : props.decision.Decision == "Deny" ? "red" : "grey"

    return (
        <Arrow
        // x={parentX}
        // y={parentY}
        points={[childX, childY, parentX, childY, parentX, parentY]}
        stroke={color}
        fill={color}
        pointerLength={10}
        pointerWidth={10}
        strokeWidth={2}
        zIndex
        />
    )
}

export default DecisionLine