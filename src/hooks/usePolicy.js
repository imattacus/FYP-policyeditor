import React,{ useState, useRef, useEffect, useContext } from 'react'
import * as Constants from '../constants/'
import PolicyEditorContext from './PolicyEditorContext'

function usePolicy(policy) {
    const context = useContext(PolicyEditorContext)
    const policyContainer = useRef(policy)
    const [policyPojo, setPolicyPojo] = useState(policy.getObject())
    const [id, setId] = useState(policy.id)
    const [depthLevel, setDepthLevel] = useState(null)
    const [isRoot, setIsRoot] = useState(false)
    // const [targetMet, setTargetMet] = useState(false)
    // const [receivedDecisions, setReceivedDecisions] = useState([])
    // const [finalDecision, setFinalDecision] = useState(undefined)

    useEffect(() => {
        return () => {
            console.log(policyContainer.current.id + " hook unmounted")
            policyContainer.current = null
        }
    }, [])

    useEffect(() => {
        if (context.selectedComponent && context.selectedComponent.id == id) {
            context.setSelectedPojo(policyPojo)
        }
    }, [context.selectedComponent])

    useEffect(() => {
        if (context.selectedComponent && context.selectedComponent.id == id) {
            context.setSelectedPojo(policyPojo)
        }
    }, [policyPojo])

    useEffect(() => {
        if (context.depthLevels) {
            if (context.depthLevels[id] == 0) setIsRoot(true)
            setDepthLevel((context.depthLevels[id] * Constants.CHILD_COMPONENT_VERTICAL_SPACE) + Constants.CANVAS_TOP_SPACE)
            // Will also update the pojo because a component might have been added or deleted
            setPolicyPojo(policyContainer.current.getObject())
        }
    }, [context.depthLevels])

    useEffect(() => {
        setPolicyPojo(policyContainer.current.getObject())
    }, [context.finalDecision])

    function setName(name) {
        policyContainer.current.setName(name)
        setPolicyPojo(policyContainer.current.getObject())
    }

    function setDescription(desc) {
        policyContainer.current.setDescription(desc)
        setPolicyPojo(policyContainer.current.getObject())
    }

    function setAlgorithm(algo) {
        policyContainer.current.setAlgorithm(algo)
        setPolicyPojo(policyContainer.current.getObject())
        context.reevaluateRequest()
    }

    // Move the policy 'up' in the parents children list 
    function moveUp() {
        policyContainer.current.moveUpInParent()
        context.recalculateDepthLevels()
        context.reevaluateRequest()
    }
    
    function moveDown() {
        policyContainer.current.moveDownInParent()
        context.recalculateDepthLevels()
        context.reevaluateRequest()
    }

    function destroy() {
        context.setSelectedComponent(undefined)
        policyContainer.current.deleteInParent()
        context.recalculateDepthLevels()
        context.reevaluateRequest()
    }

    function newPolicy() {
        policyContainer.current.newChildPolicy()
        context.recalculateDepthLevels()
        context.reevaluateRequest()
    }

    function newRule() {
        policyContainer.current.newChildRule()
        context.recalculateDepthLevels()
        context.reevaluateRequest()
    }

    // function provideDecision(decision) {
    //     setReceivedDecisions(array=> array.concat(decision))
    // }

    return {
        id: id,
        policyPojo: policyPojo,
        policyObj: policyContainer.current,
        depthLevel: depthLevel,
        isRoot: isRoot,
        setName: setName,
        setDescription: setDescription,
        setAlgorithm: setAlgorithm,
        moveUp: moveUp,
        moveDown: moveDown,
        destroy: destroy,
        newPolicy: newPolicy,
        newRule: newRule
    }
}

export default usePolicy