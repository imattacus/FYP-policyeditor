import React, { useState, useEffect } from 'react'
import './styles/ControlPanel.css'

import ShadeHeader from './ShadeHeader'

function ComponentLibraryShade(props) {
    const [isOpen, setIsOpen] = useState(props.isOpen)

    let shadeContent
    if (isOpen) {
        shadeContent = (
            <div className="shade-content">
                <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
            </div>
        )
    }

    return (
        <div className={isOpen ? "shade shade-open" : "shade shade-closed"}>
            <ShadeHeader title={"Component Toolbox"} onCollapse={setIsOpen} isOpen={isOpen}/>
            {shadeContent}
        </div>
    )
}

export default ComponentLibraryShade