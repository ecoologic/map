import React, {useContext, useState, useReducer, useRef} from 'react';
import {featureHelpers, MapContext} from './map';
import {useMount} from "../utils";

const ol = window.ol

//////////////////////////////////////////////////////////////////////////////
// Hover
const hoverSelect = () => new ol.interaction.Select({ condition: ol.events.condition.pointerMove })

export const HoverContext = React.createContext({})
export const HoverProvider = ({ children }) => {
    const { addInteraction } = useContext(MapContext)
    const [featureData, setFeatureData] = useState({})
    const select = useRef(hoverSelect()).current

    const init = () => {
        select.on('select', (ev) => {
            setFeatureData(featureHelpers.properties(ev.target)[0] || {})
        })
        addInteraction(select)
    }
    useMount('HoverProvider', init)

    const value = { featureData }
    return <HoverContext.Provider value={value}>{children}</HoverContext.Provider>
}

//////////////////////////////////////////////////////////////////////////////
// Click
const clickSelect = new ol.interaction.Select({ condition: ol.events.condition.click })

export const ClickRecordContext = React.createContext([])
export const ClickRecordProvider = ({ children }) => {
    const reducer = (state, action) => { // could be done with useState
        switch (action.type) {
            case 'CLICK':
                return [...state, action.record]
            default:
                return state
        }
    }
    const [records, dispatch] = useReducer(reducer, [])
    const addClickRecord = (record) => dispatch({ type: 'CLICK', record })

    const value = { records, addClickRecord }
    return <ClickRecordContext.Provider value={value}>{children}</ClickRecordContext.Provider>
}

export const useClickRecorded = () => {
    const { addInteraction, removeInteraction } = useContext(MapContext)
    const { records, addClickRecord } = useContext(ClickRecordContext)
    const select = clickSelect

    useMount('useClickRecorded', () => {
        select.on('select', (ev) => {
            const featuresData = featureHelpers.properties(ev.target)
            addClickRecord({ featuresData })
        })
        addInteraction(select)
    }, () => removeInteraction(select))

    return { records }
}
