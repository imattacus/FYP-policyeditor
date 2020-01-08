import React, { useState, useEffect, useContext } from 'react'
import './styles/ControlPanel.css'

import PolicyEditorContext from './hooks/PolicyEditorContext'

function PolicyComponentEditor(props) {
    const context = useContext(PolicyEditorContext)
    const selectedComponent = context.selectedComponent

    function handleNameChange(e) {
        context.selectedComponent.setName(e.target.value)
    }

    function handleDescChange(e) {
        context.selectedComponent.setDescription(e.target.value)
    }

    function handleAlgorithmChange(e) {
        selectedComponent.setAlgorithm(e.target.value)
    }

    if (context.selectedPojo) {
        return (
            <div className="policy-editor">
                <form>
                    <div className="form-group">
                        <label htmlFor="nameEntry" className="form-control-sm">Policy Name</label>
                        <input className="form-control form-control-sm" id="nameEntry" placeholder="Policy Name" value={context.selectedPojo.name} onChange={handleNameChange}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="descEntry" className="form-control-sm">Policy Description (This will be provided in the response to the user)</label>
                        <input className="form-control form-control-sm" id="descEntry" placeholder="Policy Name" value={context.selectedPojo.description} onChange={handleDescChange}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="algoEntry" className="form-control-sm">Combining Algorithm</label>
                        <select className="form-control form-control-sm" id="algoEntry" placeholder="Policy Name" value={context.selectedPojo.algorithm.getType()} onChange={handleAlgorithmChange}>
                            <option value="firstApplicable">First Applicable</option>
                            <option value="denyOverrides">Deny Overrides</option>
                            <option value="permitOverrides">Permit Overrides</option>
                            <option value="denyUnlessPermit">Deny Unless Permit</option>
                            <option value="permitUnlessDeny">Permit Unless Deny</option>
                        </select>
                    </div>
                </form>
                
                
            </div>
        )
    } else {
        return null
    }
}

export default PolicyComponentEditor
