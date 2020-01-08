import axios from 'axios'
import React, { useState, useEffect, useRef } from 'react'
import LoadingOverlay from 'react-loading-overlay'
import { BeatLoader } from 'react-spinners'
import './styles/PolicyEditor.css'
import Request from './accesscontrol/syntax/Request'

import Policy from './accesscontrol/syntax/Policy'

import PolicyStage from './PolicyStage'
import ControlPanel from './ControlPanel'
import PolicyEditorContext from './hooks/PolicyEditorContext'

// import testPolicy from './accesscontrol/policies/test.json'
// import testRequest from './accesscontrol/examples/fileowner_example_request.json'

function PolicyEditor(props) {
    const [rootPolicy, setRootPolicy] = useState(undefined)
    const [loadedRequest, setLoadedRequest] = useState(null)
    const [selectedComponent, setSelectedComponent] = useState(undefined)
    const [selectedPojo, setSelectedPojo] = useState(undefined)
    const [depthLevels, setDepthLevels] = useState(undefined)
    const [finalDecision, setFinalDecision] = useState(undefined)
    const [editorData, setEditorData] = useState(undefined)

    // Load the relevant policy from server
    useEffect(() => {
        let url = localStorage.getItem('remoteUrl')
        switch(props.selectedPolicy.type) {
            case 'device':
                console.error("Getting device policy NYI")
            case 'group':
                let groupid = props.selectedPolicy.data.id
                axios.get(url+'/users/policies/group/'+groupid, {headers: {'Authorization':props.user.id}})
                .then(response => {
                    console.log(response)
                    if (response.data.status != 'success') {
                        throw new Error("Error getting policy")
                    }
                    return response.data.data
                })
                .then(response => {
                    let policy = new Policy(null)
                    policy._obj_constructor(response)
                    let [_, depths] = policy.calculateDepthLevel(0, {})
                    setDepthLevels(depths)
                    setRootPolicy(policy)
                })
                .catch(err => {throw new Error(err)})
                axios.get(url+'/users/editor/groupdetails/'+groupid, {headers: {'Authorization': props.user.id}})
                .then(response => {
                    if (response.data.status != 'success') {
                        throw new Error("Error getting group details")
                    }
                    return response.data.data
                })
                .then(data => setEditorData(data))
                .catch(err => {throw new Error(err)})
        }
    }, [])

    useEffect(() => {
        if (rootPolicy) {
            if (loadedRequest != null) {
                reevaluateRequest()
            } else {
                rootPolicy.deactivate()
                setFinalDecision(undefined)
            }
        }  
    }, [loadedRequest])

    function recalculateDepthLevels() {
        let [_, depths] = rootPolicy.calculateDepthLevel(0, {})
        setDepthLevels(depths)
    }

    function reevaluateRequest() {
        if (rootPolicy) {
            if (rootPolicy.isApplicable(loadedRequest)) {
                setFinalDecision(rootPolicy.evaluate(loadedRequest))
            } else {
                rootPolicy.deactivate()
                setFinalDecision(undefined)
            }
        }
    }

    let context = {
        selectedComponent: selectedComponent, 
        setSelectedComponent: setSelectedComponent,
        selectedPojo: selectedPojo,
        setSelectedPojo: setSelectedPojo,
        depthLevels: depthLevels,
        recalculateDepthLevels: recalculateDepthLevels,
        request: loadedRequest,
        setRequest: setLoadedRequest,
        reevaluateRequest: reevaluateRequest,
        finalDecision: finalDecision,
        editorData: editorData
    }

    function toJson() {
        console.log(JSON.stringify(rootPolicy.toJson(), null, 4))
    }

    function sendToServer() {
        let url = localStorage.getItem('remoteUrl')
        let groupid = props.selectedPolicy.data.id
        axios.post(url+'/users/policies/group/'+groupid,{data: rootPolicy.toJson()}, {headers: {'Authorization': props.user.id}})
        .then(response => {
            console.log(response)
        })
        .catch(err => {
            console.log(err)
        })
    }

    if (!rootPolicy || !depthLevels || !editorData) {
        return (
            <LoadingOverlay
                active={true}
                spinner={<BeatLoader/>}
                text="Loading policy..">
                <div style={{height: '100vh', width:'100vh'}}></div>
            </LoadingOverlay>
        )
    }

    if (!depthLevels) return null

    return (
        <PolicyEditorContext.Provider value={context}>
            <div className="container-fullwidth">
                <div className="navbar navbar-expand navbar-dark bg-primary">
                    <div className="container">
                        <span className="navbar-brand"><button className="btn btn-outline-light btn-sm" onClick={()=> props.setSelectedPolicy(null)}>{"\u2190 Your policies"}</button></span>
                        <div className="collapse navbar-collapse">
                            <ul className="navbar-nav">
                                <li className="nav-item">
                                    <a className="nav-link active">{props.selectedPolicy.data.name}</a>
                                </li>
                                <li className="nav-item border border-light">
                                    <a className="nav-link" onClick={toJson}>toJson (in console)</a>
                                </li>
                                <li className="nav-item border border-light">
                                    <a className="nav-link" onClick={sendToServer}>Save to Server</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="diagram-container">
                    <PolicyStage policy={rootPolicy} request={loadedRequest} />
                </div>
                <div className="controlpanel-container">
                    <ControlPanel />
                </div>
            </div>
        </PolicyEditorContext.Provider>
    )
}

export default PolicyEditor