import React, { useRef, useState } from 'react'
import { useDrag } from 'react-dnd'
import './styles/Evaluable.css'
import './styles/ControlPanel.css'

import DrawerEvaluables from './DrawerEvaluables'
import DrawerActions from './DrawerActions'
import DrawerAttributes from './DrawerAttributes'

function EvaluableEditorDrawer(props) {
    const [selectedTab, setSelectedTab] = useState("evaluables")

    let content = null
    switch(selectedTab) {
        case "evaluables":
            content = <DrawerEvaluables />
            break
        case "attributes":
            content = <DrawerAttributes />
            break
        case "actions":
            content = <DrawerActions />
            break
    }

    return (
        <div className="drawer-container">
            <ul className="nav nav-tabs">
                <li className="nav-item">
                    <a href="#" className="nav-link active" onClick={() => setSelectedTab("evaluables")}>Evaluables</a>
                </li>
                <li className="nav-item">
                    <a href="#" className="nav-link active" onClick={() => setSelectedTab("attributes")}>Attributes</a>
                </li>
                <li className="nav-item">
                    <a href="#" className="nav-link active" onClick={() => setSelectedTab("actions")}>Actions</a>
                </li>
            </ul>
            <div className="drawer-contents">
                {content}
            </div>
        </div>
    )
}

export default EvaluableEditorDrawer