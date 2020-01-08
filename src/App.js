import React, { useState } from 'react'
import axios from 'axios'

import LoginScreen from './LoginScreen'
import NavigationBar from './NavigationBar'
import PolicyList from './PolicyList'
import PolicyEditor from './PolicyEditor'

function App() {
  const [loggedInUser, setLoggedInUser] = useState(JSON.parse(localStorage.getItem('user')))
  const [selectedPolicy, setSelectedPolicy] = useState(null)

  if (!loggedInUser || !localStorage.getItem('remoteUrl')) {
    return (
      <div className="App">
        <LoginScreen setLoggedInUser={setLoggedInUser} />
      </div>
    );
  }

  let pageContent
  if (!selectedPolicy) {
      pageContent = <PolicyList user={loggedInUser} setSelectedPolicy={setSelectedPolicy}/>
  } else {
      pageContent = <PolicyEditor user={loggedInUser} selectedPolicy={selectedPolicy} setSelectedPolicy={setSelectedPolicy} />
  }

  return (
    <div className="App">
        <NavigationBar setLoggedInUser={setLoggedInUser} />
        {pageContent}
    </div>
  );
}

export default App;
