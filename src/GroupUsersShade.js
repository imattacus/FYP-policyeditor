import React, { useState, useEffect, useContext } from 'react'
import './styles/ControlPanel.css'

import ShadeHeader from './ShadeHeader'
import PolicyEditorContext from './hooks/PolicyEditorContext'

// This component only exists when a component is selected, can be closed with an x arrow which deselects the component
function GroupUsersShade(props) {
    const context = useContext(PolicyEditorContext)
    const [isOpen, setIsOpen] = useState(props.isOpen)
    const [selectedUser, setSelectedUser] = useState(undefined)

    useEffect(() => {
        props.selectUser(selectedUser)
    }, [selectedUser])

    let shadeContent
    if (isOpen) {
        shadeContent = (
            <div className="shade-content">
                <table class="table table-hover">
                    <tbody>
                        {context.editorData.users.map(user => {
                            return <tr onClick={()=>setSelectedUser(user)}>
                                <td>{user.user.name} {selectedUser ? selectedUser.user.id == user.user.id ? "(Selected)" : null : null}</td>
                            </tr>
                        })}
                    </tbody>
                </table>
            </div>
        )
    }

    return (
        <div className={isOpen ? "shade shade-open" : "shade shade-closed"}>
            <ShadeHeader title={`Group Users ${selectedUser ? "Selected: " + selectedUser.user.name : ''}`} onCollapse={setIsOpen} isOpen={isOpen}/>
            {shadeContent}
        </div>
    )
}

export default GroupUsersShade