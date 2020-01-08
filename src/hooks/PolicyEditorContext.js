import React, { useState } from 'react'

const PolicyEditorContext = React.createContext(
    {
        selectedComponent: null,
        setSelectedComponent: function() {},
        request: null,
        setRequest: function() {}
    }
)

export default PolicyEditorContext