import React, { useRef, useState, useContext } from 'react'
import { useDrag } from 'react-dnd'
import './styles/Evaluable.css'
import './styles/ControlPanel.css'

import PolicyEditorContext from './hooks/PolicyEditorContext'
import DraggableEvaluable from './evaluablecomponents/DraggableEvaluable'

function DrawerAttributes(props) {
    const context = useContext(PolicyEditorContext)
    const userDefaultAttributes = context.editorData.userDefaultAttributes
    const deviceDefaultAttributes = context.editorData.deviceDefaultAttributes
    const groupCustomAttributes = context.editorData.groupCustomAttributes
    const environmentDefaultAttributes =
    context.editorData.environmentDefaultAttributes

    return (
        <div className="drawer-section">
            <div className="drawer-section-contents">
                <div className="drawer-header">
                    <span>Default User Attributes</span>
                </div>
                {userDefaultAttributes.map(attr => {
                    return <DraggableEvaluable name={attr.attribute_id} type={"Attribute"} options={attr} />
                })}
                <div className="drawer-header">
                    <span>Default Device Attributes</span>
                </div>
                {deviceDefaultAttributes.map(attr => {
                    return <DraggableEvaluable name={attr.attribute_id} type={"Attribute"} options={attr} />
                })}
                <div className="drawer-header">
                    <span>Environment Attributes</span>
                </div>
                {environmentDefaultAttributes.map(attr => {
                    return <DraggableEvaluable name={attr.attribute_id} type={"Attribute"} options={attr} />
                })}
                <div className="drawer-header">
                    <span>Group Custom Attributes</span>
                </div>
                {groupCustomAttributes.map(attr => {
                    return <DraggableEvaluable name={attr.prettyname} type={"Attribute"} options={attr} />
                })}
            </div>
        </div>
    )
}

export default DrawerAttributes