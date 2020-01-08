import React, { useState } from 'react'

function NavigationBar(props) {
    let username = JSON.parse(localStorage.getItem('user')).name
    function logout() {
        localStorage.removeItem('user')
        props.setLoggedInUser(null)
    }

    return (
        <div>
            <div className="navbar">
                <div className="container">
                    <span className="navbar-brand">IoT Policy Editor</span>
                    <button className="btn btn-outline-danger" onClick={logout}>Sign Out</button>
                </div>
            </div>
        </div>
    )
}

export default NavigationBar