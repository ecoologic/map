import React, {useContext, useState, useReducer} from 'react';
import {featureHelpers, MapContext} from './map';
import {useMount} from "../utils";

const ol = window.ol

const hoverSelect = new ol.interaction.Select({ condition: ol.events.condition.pointerMove })
const clickSelect = new ol.interaction.Select({ condition: ol.events.condition.click })

// FIXME: it's a re-rendering issue (old ones don't get updated)
// TODO? take it out or React, like view
const onSelect = (select, callback) => {
    console.log('onSelect')
    select.on('select', (ev) => {
        callback(featureHelpers.properties(ev.target))
    })
}

//////////////////////////////////////////////////////////////////////////////
// Hover

export const HoverContext = React.createContext({})
export const HoverProvider = ({ children }) => {
    const { addInteraction, removeInteraction } = useContext(MapContext)
    const [featureData, setFeatureData] = useState({})
    const select = hoverSelect

    useMount('HoverProvider', () => {
        onSelect(select, (featuresData) => {
            select.getFeatures().clear() // TODO: 
            setFeatureData(featuresData[0] || {})
        })
        addInteraction(select)
    }, () => removeInteraction(select))

    const value = { featureData }
    return <HoverContext.Provider value={value}>{children}</HoverContext.Provider>
}

//////////////////////////////////////////////////////////////////////////////
// Click
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
        onSelect(select, (featuresData) => addClickRecord({ featuresData }))
        addInteraction(select)
    }, () => removeInteraction(select))

    return { records }
}
