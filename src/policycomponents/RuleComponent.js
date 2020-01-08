import React, { useState, useEffect, useContext, useRef } from 'react'
import { Rect, Group, Text, Label, Tag } from 'react-konva'
import * as Constants from '../constants/'

import ConnectingLine from './ConnectingLine'
import DecisionLine from './DecisionLine'
import PolicyEditorContext from '../hooks/PolicyEditorContext'
import useRule from '../hooks/useRule'

function RuleComponent(props) {
    const ruleObj = useRef(props.rule)
    const ruleHook = useRule(props.rule)
    const rule = ruleHook.rulePojo
    const [parentPosition, setParentPosition] = useState(props.parentPosition)
    const [pos, setPos] = useState(null)
    const [parentActive, setParentActive] = useState(props.parentActive)
    const [isParentsDecision, setIsParentsDecision] = useState(false)
    // const [parentFinalDecision, setParentFinalDecision] = useState(props.parentFinalDecision)
    const context = useContext(PolicyEditorContext)

    const controlsRef = useRef()
    const labelRef = useRef()

    let isSelected = context.selectedComponent? context.selectedComponent.id == rule.id : false

    let isFinalDecision = context.finalDecision ? context.finalDecision.id == rule.id : false

    useEffect(() => {
        return () => {
            // Called when component is unmounted
            console.log(rule.id + " unmounted")
        }
    }, [])

    useEffect(() => {
        if (ruleHook.depthLevel != null) {
            setPos({x: props.x, y: ruleHook.depthLevel})
        }
    }, [ruleHook.depthLevel])

    useEffect(() => {
        if (pos != null) {
            if(isSelected) {
                controlsRef.current.show()
            } else {
                controlsRef.current.hide()
            }
        }
    }, [isSelected])

    useEffect(() => {
        setParentPosition(props.parentPosition)
    }, [props.parentPosition])

    useEffect(() => {
        setParentActive(props.parentActive)
    }, [props.parentActive])

    useEffect(() => {
        if (context.request != null) {
            if (rule.finalDecision && props.parentFinalDecision) {
                setIsParentsDecision(props.parentFinalDecision.id == rule.finalDecision.id)
            } else {
                setIsParentsDecision(false)
            }
        } else {
            setIsParentsDecision(false)
        }
    }, [props.parentFinalDecision])

    if (pos == null) return null

    function handleControlHoverIn(e) {
        document.body.style.cursor = "pointer"
        //e.target.setFill(Constants.LINE_COLOR_ACTIVE)
    }

    function handleControlHoverOut(e) {
        document.body.style.cursor = "default"
        //e.target.fill(Constants.LINE_COLOR_INACTIVE)
    }

    function handleSelect(e) {
        console.log(rule.id + " clicked")
        context.setSelectedComponent(ruleHook)
    }

    function handleDragMove(e) {
        setPos({x: e.target.x(), y: e.target.y()})
    }

    function handleDragEnd(e) {
        setPos({x: e.target.x(), y: e.target.y()})
    }

    let connectingLine = <ConnectingLine parentPosition={parentPosition} childPosition={pos} parentActive={parentActive} />

    let decisionLine = null
    if (isParentsDecision) {
        decisionLine = <DecisionLine parentPosition={parentPosition} childPosition={pos} decision={rule.finalDecision} />
    }

    let color = parentActive ? (rule.isTargetMet && rule.isConditionMet ? (rule.effect == "Permit" ? Constants.RULE_COMPONENT_COLOR_PERMIT : Constants.RULE_COMPONENT_COLOR_DENY) : Constants.RULE_COMPONENT_COLOR_INAPPLICABLE) : Constants.RULE_COMPONENT_COLOR_INACTIVE

    let border_color = isSelected ? Constants.COMPONENT_BORDER_COLOR_SELECTED : Constants.COMPONENT_BORDER_COLOR_UNSELECTED
    let second_text = rule.isIndeterminate ? "Indeterminate" : rule.isTargetMet ? rule.isConditionMet ? rule.effect : "Condition not met" : "Target not met"

    let thisComponent = (
        <Group x={pos.x} y={pos.y} draggable onDragMove={handleDragMove} onDragEnd={handleDragEnd} onClick={handleSelect}>
            <Rect
                x={0}
                y={0}
                width={Constants.RULE_COMPONENT_WIDTH}
                height={Constants.RULE_COMPONENT_HEIGHT}
                fill={color}
                stroke={border_color}
            />
            <Text
                x={Constants.RULE_COMPONENT_HEIGHT * 0.1}
                y={Constants.RULE_COMPONENT_HEIGHT * 0.1}
                text={rule.name}
                fontSize={15}
                fontFamily={'Calibri'}
                fill={'black'}
            />
            <Text
                x={Constants.POLICY_COMPONENT_HEIGHT * 0.1}
                y={Constants.POLICY_COMPONENT_HEIGHT * 0.5}
                text={parentActive ? second_text : ""}
                fontSize={15}
                fontFamily={'Calibri'}
                fill={'black'}
            />
            <Label
                x={Constants.RULE_COMPONENT_WIDTH + 5}
                y={Constants.RULE_COMPONENT_HEIGHT / 2}
                tag={labelRef}
                visible={isFinalDecision}>
                    <Tag
                    pointerDirection={'left'}
                    pointerWidth={10}
                    pointerHeight={10}
                    fill={context.finalDecision? context.finalDecision.Decision == "Permit" ? 'green' : context.finalDecision.Decision == "Deny" ? 'red' : 'grey' : 'black'}
                    lineJoin='round'
                    />
                    <Text
                        text={'Final decision'}
                        fontSize={18}
                        padding={5}
                        fill={'white'}
                    />
            </Label>
            <Group ref={controlsRef} visible={false}>
                <Text
                    x={Constants.POLICY_COMPONENT_WIDTH + 5}
                    y={0}
                    fontSize={15}
                    fontFamily="FontAwesome"
                    fill={Constants.LINE_COLOR_INACTIVE}
                    onMouseEnter={handleControlHoverIn}
                    onMouseLeave={handleControlHoverOut}
                    onClick={ruleHook.moveUp}
                    text={'\uf062'}
                />
                <Text
                    x={Constants.POLICY_COMPONENT_WIDTH + 5}
                    y={20}
                    fontSize={15}
                    fontFamily="FontAwesome"
                    fill={Constants.LINE_COLOR_INACTIVE}
                    onMouseEnter={handleControlHoverIn}
                    onMouseLeave={handleControlHoverOut}
                    text={'\uf063'}
                    onClick={ruleHook.moveDown}
                />
                <Text
                    x={Constants.POLICY_COMPONENT_WIDTH + 5}
                    y={40}
                    fontSize={15}
                    fontFamily="FontAwesome"
                    fill={Constants.LINE_COLOR_INACTIVE}
                    onMouseEnter={handleControlHoverIn}
                    onMouseLeave={handleControlHoverOut}
                    text={'\uf1f8'}
                    onClick={ruleHook.destroy}
                />
            </Group>
        </Group>
    )

    return (
        <>
        {connectingLine}
        {decisionLine}
        {thisComponent}
        </>
    )
}

export default RuleComponent