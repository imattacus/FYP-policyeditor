import React, { useState, useEffect, useContext } from 'react'
import './styles/ControlPanel.css'

import ShadeHeader from './ShadeHeader'
import PolicyEditorContext from './hooks/PolicyEditorContext'

// This component only exists when a component is selected, can be closed with an x arrow which deselects the component
function GroupDevicesShade(props) {
    const context = useContext(PolicyEditorContext)
    const [isOpen, setIsOpen] = useState(props.isOpen)
    const [selectedDevice, setSelectedDevice] = useState(undefined)
    

    useEffect(() => {
        props.selectDevice(selectedDevice)
    }, [selectedDevice])

    let shadeContent
    if (isOpen) {
        shadeContent = (
            <div className="shade-content">
                <table class="table table-hover">
                    <tbody>
                        {context.editorData.devices.map(device=> {
                            return <tr onClick={()=>setSelectedDevice(device)}>
                                <td>{device.device.name} {selectedDevice ? selectedDevice.device.id == device.device.id ? "(Selected)" : null : null}</td>
                            </tr>
                        })}
                    </tbody>
                </table>
            </div>
        )
    }

    return (
        <div className={isOpen ? "shade shade-open" : "shade shade-closed"}>
            <ShadeHeader title={`Group Devices ${selectedDevice ? "Selected: " + selectedDevice.device.name : ''}`} onCollapse={setIsOpen} isOpen={isOpen}/>
            {shadeContent}
        </div>
    )
}

export default GroupDevicesShade