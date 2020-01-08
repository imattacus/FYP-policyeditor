import React, { useState, useEffect, useContext } from 'react'
import './styles/ControlPanel.css'
import { DndProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

import ShadeHeader from './ShadeHeader'
import PolicyComponentEditor from './PolicyComponentEditor'
import PolicyEditorContext from './hooks/PolicyEditorContext'
import RuleComponentEditor from './RuleComponentEditor'
import EvaluableShade from './EvaluableShade'
import EvaluableEditorDrawer from './EvaluableEditorDrawer'

// This component only exists when a component is selected, can be closed with an x arrow which deselects the component
function SelectedComponentShade(props) {
    const [isOpen, setIsOpen] = useState(props.isOpen)
    const context = useContext(PolicyEditorContext)
    const [drawerOpen, setDrawerOpen] = useState(false)

    function handleRemove() {
        context.setSelectedComponent(undefined)
        context.setSelectedPojo(undefined)
    }

    let shadeContent = null
    let evaluableShades = null
    if (context.selectedPojo) {
        let propNames = Object.getOwnPropertyNames(context.selectedPojo)
        if (propNames.includes('children')) {
            // This is a policy object
            shadeContent=<PolicyComponentEditor />
            evaluableShades = <EvaluableShade title={"Target"} evaluable={context.selectedPojo.target} setDrawerOpen={setDrawerOpen}/>
        } else if (propNames.includes('condition')) {
            // Selected compone tis  a rule
            shadeContent=<RuleComponentEditor />
            evaluableShades = (
                <>
                <EvaluableShade title={"Target"} evaluable={context.selectedPojo.target} setDrawerOpen={setDrawerOpen}/>
                <EvaluableShade title={"Condition"} evaluable={context.selectedPojo.condition} setDrawerOpen={setDrawerOpen}/>
                </>
            )
        }
    }

    
    
    

    return (
        <>
        <DndProvider backend={HTML5Backend}>
            <div className={isOpen ? "shade shade-open" : "shade shade-closed"}>
                <ShadeHeader title={"Selected Component"} removeable onCollapse={setIsOpen} isOpen={isOpen} onRemove={handleRemove}/>
                <div className="shade-content">
                    {isOpen ? shadeContent : null}
                </div>
            </div>
            {evaluableShades}
            {drawerOpen ? <EvaluableEditorDrawer /> : null}
        </DndProvider>
        </>
    )

    
}

export default SelectedComponentShade