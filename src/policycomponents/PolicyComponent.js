import React, { useState, useEffect, useContext, useRef } from 'react'
import { Group, Rect, Text, Label, Tag } from 'react-konva'
import * as Constants from '../constants/'
import Konva from 'konva'

import RuleComponent from './RuleComponent'
import ConnectingLine from './ConnectingLine'
import DecisionLine from './DecisionLine'
import PolicyEditorContext from '../hooks/PolicyEditorContext'
import usePolicy from '../hooks/usePolicy'

// Will be passed the details of the 
function PolicyComponent(props) {
    const policyObj = useRef(props.policy)
    const policyHook = usePolicy(props.policy)
    const policy = policyHook.policyPojo
    const [parentPosition, setParentPosition] = useState(props.parentPosition)
    const [parentActive, setParentActive] = useState(props.parentActive)
    const [pos, setPos] = useState(null)
    const context = useContext(PolicyEditorContext)
    const controlsRef = useRef()
    const [isParentsDecision, setIsParentsDecision] = useState(false)

    let isSelected = context.selectedComponent ? context.selectedComponent.id == policy.id : false

    let isFinalDecision = context.finalDecision ? context.finalDecision.id == policy.id : false

    useEffect(() => {
        if (policyHook.depthLevel != null) {
            setPos({x: props.x, y: policyHook.depthLevel})
        }
    }, [policyHook.depthLevel])

    useEffect(() => {
        if (policy) {
            console.log("Is indeterminate:" + policy.isIndeterminate)
        }
    }, [policy])

    // Update state that parents position has changed - so that the connecting lines props are updated and is redrawn
    useEffect(() => {
        setParentPosition(props.parentPosition)
    }, [props.parentPosition])

    useEffect(() => {
        setParentActive(props.parentActive)
    }, [props.parentActive])

    useEffect(() => {
        if (context.request != null) {
            if (props.parentFinalDecision && policy.finalDecision) {
                setIsParentsDecision(props.parentFinalDecision.id == policy.finalDecision.id)
            } else {
                setIsParentsDecision(false)
            }
        } else {
            setIsParentsDecision(false)
        } 
    }, [props.parentFinalDecision])

    if (pos == null) {return null}

    function handleControlHoverIn(e) {
        document.body.style.cursor = "pointer"
        //e.target.setFill(Constants.LINE_COLOR_ACTIVE)
    }

    function handleControlHoverOut(e) {
        document.body.style.cursor = "default"
        //e.target.fill(Constants.LINE_COLOR_INACTIVE)
    }

    function handleSelect(e) {
        console.log(policy.id + ' selected')
        context.setSelectedComponent(policyHook)
    }

    function handleDragMove(e) {
        setPos({x: e.target.x(), y: e.target.y()})
    }

    function handleDragEnd(e) {
        setPos({x: e.target.x(), y: e.target.y()})
    }

    let connectingLine = <ConnectingLine parentPosition={parentPosition} childPosition={pos} parentActive={parentActive} />

    let decisionLine = null
    if (isParentsDecision && context.finalDecision) {
        decisionLine = <DecisionLine parentPosition={parentPosition} childPosition={pos} decision={policy.finalDecision} />
    }

    let border_color = isSelected ? Constants.COMPONENT_BORDER_COLOR_SELECTED : Constants.COMPONENT_BORDER_COLOR_UNSELECTED
    let background_color = policy.isIndeterminate ? Constants.INDETERMINATE_COLOR : Constants.POLICY_COMPONENT_COLOR

    let thisGroupComponent = (
        <Group x={pos.x} y={pos.y} draggable onDragMove={handleDragMove} onDragEnd={handleDragEnd} onClick={handleSelect} >
            <Rect
                x={0}
                y={0}
                width={Constants.POLICY_COMPONENT_WIDTH}
                height={Constants.POLICY_COMPONENT_HEIGHT}
                fill={background_color}
                stroke={border_color}
            />
            <Text
                x={Constants.POLICY_COMPONENT_HEIGHT * 0.1}
                y={Constants.POLICY_COMPONENT_HEIGHT * 0.1}
                text={policy.name}
                fontSize={15}
                fontFamily={'Calibri'}
                fill={'black'}
            />
            <Text
                x={Constants.POLICY_COMPONENT_HEIGHT * 0.1}
                y={Constants.POLICY_COMPONENT_HEIGHT * 0.5}
                // text={`Target met: ${policy.isTargetMet}`}
                text={policy.isIndeterminate ? "Indeterminate" : policy.isTargetMet ? "Target met" : ""}
                fontSize={15}
                fontFamily={'Calibri'}
                fill={'black'}
            />
            <Label
                x={Constants.RULE_COMPONENT_WIDTH + 5}
                y={Constants.RULE_COMPONENT_HEIGHT / 2}
                visible={isFinalDecision}>
                    <Tag
                    pointerDirection={'left'}
                    pointerWidth={10}
                    pointerHeight={10}
                    fill={context.finalDecision ? context.finalDecision.Decision == "Permit" ? 'green' : context.finalDecision.Decision == "Deny" ? 'red' : 'grey' : 'black'}
                    lineJoin='round'
                    />
                    <Text
                        text={'Final decision'}
                        fontSize={18}
                        padding={5}
                        fill={'white'}
                    />
            </Label>
            <Group ref={controlsRef} visible={isSelected}>
                {(policyHook.isRoot ? null : <Text
                    x={Constants.POLICY_COMPONENT_WIDTH + 5}
                    y={0}
                    fontSize={15}
                    fontFamily="FontAwesome"
                    fill={Constants.LINE_COLOR_INACTIVE}
                    onMouseEnter={handleControlHoverIn}
                    onMouseLeave={handleControlHoverOut}
                    text={'\uf062'}
                    onClick={policyHook.moveUp}
                />)}
                {(policyHook.isRoot ? null : <Text
                    x={Constants.POLICY_COMPONENT_WIDTH + 5}
                    y={20}
                    fontSize={15}
                    fontFamily="FontAwesome"
                    fill={Constants.LINE_COLOR_INACTIVE}
                    onMouseEnter={handleControlHoverIn}
                    onMouseLeave={handleControlHoverOut}
                    text={'\uf063'}
                    onClick={policyHook.moveDown}
                />)}
                {(policyHook.isRoot ? null : <Text
                    x={Constants.POLICY_COMPONENT_WIDTH + 5}
                    y={40}
                    fontSize={15}
                    fontFamily="FontAwesome"
                    fill={Constants.LINE_COLOR_INACTIVE}
                    onMouseEnter={handleControlHoverIn}
                    onMouseLeave={handleControlHoverOut}
                    text={'\uf1f8'}
                    onClick={policyHook.destroy}
                />)}
                <Text
                    x={0}
                    y={Constants.POLICY_COMPONENT_HEIGHT + 5}
                    fontSize={13}
                    fontFamily="FontAwesome"
                    fill={Constants.LINE_COLOR_INACTIVE}
                    onMouseEnter={handleControlHoverIn}
                    onMouseLeave={handleControlHoverOut}
                    text={'\uf067 Policy'}
                    onClick={policyHook.newPolicy}
                />
                <Text
                    x={Constants.POLICY_COMPONENT_WIDTH * 0.6}
                    y={Constants.POLICY_COMPONENT_HEIGHT + 5}
                    fontSize={13}
                    fontFamily="FontAwesome"
                    fill={Constants.LINE_COLOR_INACTIVE}
                    onMouseEnter={handleControlHoverIn}
                    onMouseLeave={handleControlHoverOut}
                    text={'\uf067 Rule'}
                    onClick={policyHook.newRule}
                />
            </Group>
        </Group>
    )

    let childrenComponents = null
    if (policy.children.length > 0) {
        childrenComponents = policy.children.map(child => {
            if ('children' in child) {
                return <PolicyComponent
                        key={child.id}
                        policy={child}
                        x={props.x + Constants.CHILD_COMPONENT_HORIZONTAL_INDENT}
                        parentPosition={pos}
                        parentActive={policy.isActive}
                        parentFinalDecision={policy.finalDecision}
                        />
            } else {
                return  <RuleComponent
                        key={child.id}
                        rule={child}
                        x={props.x + Constants.CHILD_COMPONENT_HORIZONTAL_INDENT}
                        parentPosition={pos}
                        parentActive={policy.isActive}
                        parentFinalDecision={policy.finalDecision}
                        />
            }
        })
    }

    return (
        <>
        {thisGroupComponent} 
        {context.finalDecision ? decisionLine : null}
        {connectingLine}
        {childrenComponents}
        </>
    )
}

export default PolicyComponent