import React, { useState, useContext, useEffect, useRef } from 'react'
import './styles/ControlPanel.css'
import Request from './accesscontrol/syntax/Request'

import PolicyEditorContext from './hooks/PolicyEditorContext'
import GroupUsersShade from './GroupUsersShade'
import GroupDevicesShade from './GroupDevicesShade'
import EnvironmentShade from './EnvironmentShade'

import * as Constants from './constants/'

function RequestBuilder(props) {
    const context = useContext(PolicyEditorContext)
    const [selectedUser, setSelectedUser] = useState(undefined)
    const [selectedDevice, setSelectedDevice] = useState(undefined)
    const [selectedActionType, setSelectedActionType] = useState("")
    const envAttributes = context.editorData.environmentDefaultAttributes
    const dateAttribute = useRef(envAttributes.find(attr => attr.attribute_id == 'env_date'))
    const timeAttribute = useRef(envAttributes.find(attr => attr.attribute_id == 'env_time'))
    const [timeValue, setTimeValue] = useState(timeAttribute.current.value)
    const [dateValue, setDateValue] = useState(dateAttribute.current.value)

    function handleStop() {
        context.setRequest(null)
    }

    function handleRun() {
        if (selectedUser != undefined && selectedDevice != undefined && selectedActionType != "" && timeValue != "" && dateValue != "") {
            let request = new Request()
            request.Subject = selectedUser.attributes
            request.Action.Type = selectedActionType
            request.Resource = selectedDevice.attributes
            request.Environment.Attributes = [
                {
                    attribute_id: 'env_date',
                    data_type: 'integer',
                    value: dateValue
                },
                {
                    attribute_id: 'env_time',
                    data_type: 'integer',
                    value: timeValue
                }
            ]
            console.log(request)
            context.setRequest(request)
        }
    }
    
    function handleActionTypeChange(e) {
        setSelectedActionType(e.target.value)
    }

    return (
        <>
        <div className="shade">
            <div className="shade-header">
                <span className="title">Request Builder</span>
                <div className="shade-controls">
                    <i className="fa fa-stop" onClick={handleStop}></i>
                    <i className="fa fa-play" onClick={handleRun}></i>
                </div>
            </div>
            <div className="shade-content request-builder">
                <span>Selected User: {selectedUser ? selectedUser.user.name : "None"}</span>
                <span>Selected Device: {selectedDevice ? selectedDevice.device.name : "None"}</span>
                <div className="form-group">
                        <select className="form-control form-control-sm" id="actionType" placeholder="Select Action Type" value={selectedActionType} onChange={handleActionTypeChange}>
                            <option value="" disabled selected>Select an Action Type</option>
                            <option value="power_control">Power Control</option>
                            <option value="config1">Config Data 1</option>
                            <option value="config2">Config Data 2</option>
                        </select>
                    </div>
            </div>
        </div>
        <GroupUsersShade selectUser={setSelectedUser} />
        <GroupDevicesShade selectDevice={setSelectedDevice} />
        <EnvironmentShade setTime={setTimeValue} time={timeValue} setDate={setDateValue} date={dateValue} />
        </>
    )
}

export default RequestBuilder