import React, { useState } from 'react'
import axios from 'axios'

import './styles/LoginScreen.css';

function LoginScreenComponent(props) {
    const [username, setUsername] = useState("")
    const [remote, setRemote] = useState("http://localhost:3002")
    const [failed, setFailed] = useState(false)
    const [error, setError] = useState("")

    function submit() {
        axios.post(remote+"/users/login", {username: username})
        .then(response => {
            if (response.data.status == "success") {
                localStorage.setItem('remoteUrl', remote)
                localStorage.setItem('user', JSON.stringify(response.data.user))
                props.setLoggedInUser(response.data.user)
            } else {
                setError("Connection to remote established, but login details incorrect!")
                setFailed(true)
            }
        })
        .catch(err => {
            console.log(err)
            setError("Could not connect to remote!")
            setFailed(true)
        })
    }

    let failedAlert
    if (failed) {
        failedAlert = (
            <div className="alert alert-danger" role="alert">{error}</div>
        )
    }

    return (
        <div className="container-fluid">
            <div className="row align-items-center vertical-center">
                <div className="col-sm-3"></div>
                <div className="col-sm-6">
                    <div className="jumbotron">
                        {failedAlert}
                        <div className="form-group">
                            <label>Username</label>
                            <input className="form-control" placeholder="Enter your username" value={username} onChange={e=>setUsername(e.target.value)}></input>
                        </div>
                        <div className="form-group">
                            <label>Remote URL</label>
                            <input className="form-control" placeholder="Enter the hostname of remote server" value={remote} onChange={e=>setRemote(e.target.value)}></input>
                        </div>
                        <button type="submit" className="btn btn-primary btn-block" onClick={submit}>Sign In</button>
                    </div>
                </div>
                <div className="col-sm-3"></div>
            </div>
        </div>
    );
}

export default LoginScreenComponent