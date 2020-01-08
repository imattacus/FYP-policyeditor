import axios from 'axios'
import React, { useState, useEffect } from 'react'
import './styles/PolicyList.css'

function PolicyList(props) {
    const [groupPolicies, setGroupPolicies] = useState([])
    const [devicePolicies, setDevicePolicies] = useState([])

    useEffect(() => {
        axios.get(localStorage.getItem('remoteUrl')+"/users/policies", {headers:{'Authorization':props.user.id}})
        .then(response => {
            setGroupPolicies(response.data.groups)
            setDevicePolicies(response.data.devices)
        })
        .catch(err => console.log(err))
    }, [])

    let groupSection = null
    if (groupPolicies.length > 0) {
        groupSection = (
            <>
                <thead>
                    <tr>
                        <th scope='col'>Groups</th>
                        <th scope='col'>Filename</th>
                    </tr>
                </thead>
                <tbody>
                    {groupPolicies.map(policy => 
                    <tr onClick={() => props.setSelectedPolicy({type:'group', data: policy})}>
                        <td scope='row'>{policy.name}</td>
                        <td>group_{policy.id}.json</td>
                    </tr>
                    )}
                </tbody>
            </>
        )
    }

    // let deviceSection = null
    // if (devicePolicies.length > 0) {
    //     deviceSection = (
    //         <>
    //             <thead>
    //                 <tr>
    //                     <th scope='col'>Devices</th>
    //                     <th scope='col'></th>
    //                 </tr>
    //             </thead>
    //             <tbody>
    //                 {devicePolicies.map(policy => 
    //                     <tr onClick={() => props.setSelectedPolicy({type:'device', data: policy})}>
    //                         <td scope='row'>{policy.name}</td>
    //                         <td>device_{policy.id}.json</td>
    //                     </tr>
    //                 )}
    //             </tbody>
    //         </>
    //     )
    // }

    return (
        <div className="container">
            <div className="row">
                <table className="table table-hover" id="policyListTable">
                    {groupSection}
                </table>
            </div>
        </div>
    )
}

export default PolicyList