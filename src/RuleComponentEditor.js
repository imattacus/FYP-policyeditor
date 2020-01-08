import React, { useState, useEffect, useContext } from 'react'
import './styles/ControlPanel.css'

import PolicyEditorContext from './hooks/PolicyEditorContext'

function RuleComponentEditor(props) {
    const context = useContext(PolicyEditorContext)

    function handleNameChange(e) {
        context.selectedComponent.setName(e.target.value)
    }

    function handleDescChange(e) {
        context.selectedComponent.setDescription(e.target.value)
    }
    
    function handleEffectChange(e) {
        context.selectedComponent.setEffect(e.target.value)
    }

    if (context.selectedPojo) {
        return (
            <div className="policy-editor">
                <form>
                    <div className="form-group">
                        <label htmlFor="nameEntry" className="form-control-sm">Rule Name</label>
                        <input className="form-control form-control-sm" id="nameEntry" placeholder="Rule Name" value={context.selectedPojo.name} onChange={handleNameChange}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="descEntry" className="form-control-sm">Rule Description (This will be provided in the response to the user)</label>
                        <input className="form-control form-control-sm" id="descEntry" placeholder="Rule Description" value={context.selectedPojo.description} onChange={handleDescChange}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="effectEntry" className="form-control-sm">Effect</label>
                        <select className="form-control form-control-sm" id="effectEntry" placeholder="Policy Name" value={context.selectedPojo.effect} onChange={handleEffectChange}>
                            <option value="Permit">Permit</option>
                            <option value="Deny">Deny</option>
                        </select>
                    </div>
                </form>
            </div>
        )
    } else {
        return null
    }
}

export default RuleComponentEditor