import React,{ useState, useRef, useEffect, useContext } from 'react'

import PolicyEditorContext from './PolicyEditorContext'
import * as Constants from '../constants/'

function useRule(rule) {
    const context = useContext(PolicyEditorContext)
    const ruleContainer = useRef(rule)
    const [rulePojo, setRulePojo] = useState(rule.getObject())
    const [id, setId] = useState(rule.id)
    const [depthLevel, setDepthLevel] = useState(null)
    const [finalDecision, setFinalDecision] = useState(undefined)

    useEffect(() => {
        return () => {
            console.log(ruleContainer.current.id + " hook unmounted")
            ruleContainer.current = null
        }
    }, [])

    useEffect(() => {
        if (context.selectedComponent && context.selectedComponent.id == id) {
            context.setSelectedPojo(rulePojo)
        }
    }, [context.selectedComponent])

    useEffect(() => {
        if (context.selectedComponent && context.selectedComponent.id == id) {
            context.setSelectedPojo(rulePojo)
        }
    }, [rulePojo])

    useEffect(() => {
        if (context.depthLevels) {
            setDepthLevel((context.depthLevels[id] * Constants.CHILD_COMPONENT_VERTICAL_SPACE) + Constants.CANVAS_TOP_SPACE)
            setRulePojo(ruleContainer.current.getObject())
        }
    }, [context.depthLevels])

    useEffect(() => {
        setRulePojo(ruleContainer.current.getObject())
    }, [context.finalDecision])

    function setName(name) {
        ruleContainer.current.setName(name)
        setRulePojo(ruleContainer.current.getObject())
    }

    function setDescription(desc) {
        ruleContainer.current.setDescription(desc)
        setRulePojo(ruleContainer.current.getObject())
    }

    function setEffect(effect) {
        ruleContainer.current.setEffect(effect)
        setRulePojo(ruleContainer.current.getObject())
        context.reevaluateRequest()
    }

    function moveUp() {
        ruleContainer.current.moveUpInParent()
        context.recalculateDepthLevels()
        context.reevaluateRequest()
    }

    function moveDown() {
        ruleContainer.current.moveDownInParent()
        context.recalculateDepthLevels()
        context.reevaluateRequest()
    }

    function destroy() {
        context.setSelectedComponent(undefined)
        ruleContainer.current.deleteInParent()
        context.recalculateDepthLevels()
        context.reevaluateRequest()
    }

    return {
        id: id,
        rulePojo: rulePojo,
        ruleObj: ruleContainer.current,
        setName: setName,
        setDescription: setDescription,
        setEffect: setEffect,
        depthLevel: depthLevel,
        moveUp: moveUp,
        moveDown: moveDown,
        destroy: destroy,
        finalDecision: finalDecision
    }
}

export default useRule