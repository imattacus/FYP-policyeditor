import React, {useEffect, useState} from 'react'

import useEvaluable from '../hooks/useEvaluable'

import EmptyComponent from './EmptyComponent'
import CombinatorComponent from './CombinatorComponent'
import AttributeComponent from './AttributeComponent'
import HasAttributeComponent from './HasAttributeComponent'
import ValueComponent from './ValueComponent'
import ComparatorComponent from './ComparatorComponent'
import ActionTypeComponent from './ActionTypeComponent'

// A higher order component that receives an evaluable object and returns the correct component to visualise it
function EvaluableComponent(props) {
    let evalHook = useEvaluable(props.evaluable)
    let [isEditing, setIsEditing] = useState(props.isEditing)
    
    useEffect(() => {
        setIsEditing(props.isEditing)
    }, [props.isEditing])

    if (evalHook.evaluablePojo.error) {
        console.log("error " + evalHook.evaluablePojo.errordetail)
    }

    let finalComponent
    switch(evalHook.evaluablePojo.op) {
        case 'empty':
            finalComponent = <EmptyComponent evaluable={evalHook} isEditing={isEditing}/>
            break
        case 'value':
            finalComponent = <ValueComponent evaluable={evalHook} isEditing={isEditing}/>
            break
        case 'environmentAttribute':
        case 'subjectAttribute':
        case 'resourceAttribute':
            finalComponent = <AttributeComponent evaluable={evalHook} isEditing={isEditing}/>
            break
        case 'combinator':
            finalComponent = <CombinatorComponent evaluable={evalHook} isEditing={isEditing}/>
            break
        case 'comparator':
            finalComponent = <ComparatorComponent evaluable={evalHook} isEditing={isEditing}/>
            break
        case 'subjectHasAttribute':
        case 'resourceHasAttribute':
            finalComponent = <HasAttributeComponent evaluable={evalHook} isEditing={isEditing}/>
            break
        case 'actionType':
            finalComponent = <ActionTypeComponent evaluable={evalHook} isEditing={isEditing} />
            break
        default:
            throw new Error("EvaluableComponent could not match this evaluable objects op to a component")
    }

    return finalComponent
}

export default EvaluableComponent