import React, { useState, useEffect } from 'react'
import { Arrow } from 'react-konva' 
import * as Constants from '../constants/'

// Component for connecting 2 boxes and will track as they're moved
function ConnectingLine(props) {
    const [active, setActive] = useState(props.parentActive)

    useEffect(() => {
        setActive(props.parentActive)
    }, [props.parentActive])

    let parentX
    let parentY
    let childX
    let childY
    if (props.parentPosition.x != 0 && props.parentPosition.y != 0) {
        parentX = props.parentPosition.x + (Constants.POLICY_COMPONENT_WIDTH / 2)
        parentY = props.parentPosition.y + (Constants.POLICY_COMPONENT_HEIGHT)
        childX = props.childPosition.x
        childY = props.childPosition.y + (Constants.POLICY_COMPONENT_HEIGHT / 2)
    } else {
        parentX = props.parentPosition.x
        parentY = props.childPosition.y + (Constants.POLICY_COMPONENT_HEIGHT / 2)
        childX = props.childPosition.x
        childY = props.childPosition.y + (Constants.POLICY_COMPONENT_HEIGHT / 2)
    }

    let color = active ? Constants.LINE_COLOR_ACTIVE : Constants.LINE_COLOR_INACTIVE

    // let finalDecisionLine = null
    // if (isFinalDecision) {
    //     finalDecisionLine = (

    //     )
    // }

    return (
        <Arrow
        // x={parentX}
        // y={parentY}
        points={[parentX, parentY, parentX, childY, childX, childY]}
        stroke={color}
        fill={color}
        pointerLength={10}
        pointerWidth={10}
        strokeWidth={2}
        zIndex
        />
    )
}

export default ConnectingLine