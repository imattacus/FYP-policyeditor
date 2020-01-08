import React, { useState, useEffect, useContext } from 'react'

import SelectedComponentShade from './SelectedComponentShade'
import RequestBuilder from './RequestBuilder'

import './styles/ControlPanel.css'

import PolicyEditorContext from './hooks/PolicyEditorContext'

function ControlPanel(props) {
    const context = useContext(PolicyEditorContext)
 

    return (
        <>
        <div className="controlpanel-top">
            {context.selectedComponent != undefined ? <SelectedComponentShade isOpen={true} /> : null}
        </div>
        <div className="controlpanel-bottom">
            <RequestBuilder />
        </div>
        </>
    )
}

export default ControlPanel