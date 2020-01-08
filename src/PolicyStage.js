import React, { useState, useEffect, useRef } from 'react'
import { Canvas, Stage, Layer, Rect } from 'react-konva'
import FontFaceObserver from 'fontfaceobserver'

import Policy from './accesscontrol/syntax/Policy'
import Request from './accesscontrol/syntax/Request'
import './styles/PolicyStage.css'
import * as Constants from './constants/'

import PolicyComponent from './policycomponents/PolicyComponent'
//import SelectedComponentContext from './hooks/SelectedComponentContext'
import PolicyEditorContext from './hooks/PolicyEditorContext'

function PolicyStage(props) {
    // const [policy, setPolicy] = useState(null)
    const layerRef = useRef()

    useEffect(() => {
        let font = new FontFaceObserver("FontAwesome")
        font.load().then(()=> {
            if (layerRef.current) {
                layerRef.current.draw()
            }
        })
    }, [])

    // useEffect(() => {
    //     setPolicy(props.policy)
    // }, [props.policy])

    if (props.policy == null) return null;


    return(
        <PolicyEditorContext.Consumer>
            {(context) => (
                <Stage width={1000} height={1000}>
                <PolicyEditorContext.Provider value={context}>
                <Layer ref={layerRef}>
                    <PolicyComponent 
                    policy={props.policy} 
                    x={Constants.CANVAS_LEFT_SPACE} 
                    parentPosition={{x:0, y:0}} 
                    parentActive={true}
                    />
                </Layer>
                </PolicyEditorContext.Provider>
                </Stage>
            )}
        </PolicyEditorContext.Consumer>
    )
}

export default PolicyStage