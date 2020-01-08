import React, { useState, useEffect, useContext, useRef } from 'react'
import Evaluable from '../accesscontrol/syntax/Evaluable'

import PolicyEditorContext from './PolicyEditorContext'
import EvaluableErrorContext from './EvaluableErrorContext'

function useEvaluable(evaluable) {
    const context = useContext(PolicyEditorContext)
    const errorContext = useContext(EvaluableErrorContext)
    const evaluableContainer = useRef(evaluable)
    const [evaluablePojo, setEvaluablePojo] = useState(evaluable.getObject())

    useEffect(() => {
        // Refresh object if there has been an error
        setEvaluablePojo(evaluableContainer.current.getObject())
    }, [errorContext.error])

    // Should only be called by Empty components!!
    function setOp(op, comOp) {
        if (evaluableContainer.current.op != 'empty') {
            throw new Error('Cannot change the op of an existing evaluable')
        }
        switch(op) {
            case 'subjectHasAttribute':
                evaluableContainer.current.initSubjectHasAttribute()
                break
            case 'resourceHasAttribute':
                evaluableContainer.current.initResourceHasAttribute()
                break
            case 'subjectAttribute':
                evaluableContainer.current.initSubjectAttribute()
                break
            case 'resourceAttribute':
                evaluableContainer.current.initResourceAttribute()
                break
            case 'environmentAttribute':
                evaluableContainer.current.initEnvironmentAttribute()
                break
            case 'comparator':
                evaluableContainer.current.initComparator(comOp)
                break
            case 'combinator':
                evaluableContainer.current.initCombinator(comOp)
                break
            case 'value':
                evaluableContainer.current.initValue()
                break
            case 'actionType':
                evaluableContainer.current.initActionType()
                break
            default:
                throw new Error("Could not set op to invalid op")
        }
        setEvaluablePojo(evaluableContainer.current.getObject())
    }

    function setAttribute(attr) {
        evaluableContainer.current.attr = {attribute_id: attr.attribute_id, data_type: attr.data_type}
        setEvaluablePojo(evaluableContainer.current.getObject())
    }

    function setEmpty() {
        evaluableContainer.current.resetToEmpty()
        setEvaluablePojo(evaluableContainer.current.getObject())
    }

    function setAction(type) {
        evaluableContainer.current.setAction(type)
        setEvaluablePojo(evaluableContainer.current.getObject())
    }

    function combinatorAdd() {
        if (evaluableContainer.current.op != "combinator") {
            throw new Error("Cannot add to non combinator")
        }
        evaluableContainer.current.combinatorAddChild()
        setEvaluablePojo(evaluableContainer.current.getObject())
    }

    function setValue(value) {
        if (evaluableContainer.current.op != 'value') {
            throw new Error("cannot set value of non value eval")
        }
        evaluableContainer.current.setValue(value)
        setEvaluablePojo(evaluableContainer.current.getObject())
    }

    function setDataType(dt) {
        if (evaluableContainer.current.op != 'value') {
            throw new Error("cannot set value of non value eval")
        }
        evaluableContainer.current.data_type = dt
        setEvaluablePojo(evaluableContainer.current.getObject())
    }

    return {
        evaluableObj: evaluableContainer.current,
        evaluablePojo: evaluablePojo,
        setOp: setOp,
        setEmpty: setEmpty,
        combinatorAdd: combinatorAdd,
        setAttribute: setAttribute,
        setValue: setValue,
        setDataType: setDataType,
        setAction: setAction
    }
}

export default useEvaluable