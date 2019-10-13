import React, {useContext, useState, useReducer} from 'react';
import {featureHelpers, MapContext} from './map';
import {useMount} from "../utils";

const ol = window.ol

const clickSelect = new ol.interaction.Select({ condition: ol.events.condition.click })

const onSelect = (select, callback) => {
    console.log('onSelect')
    select.on('select', (ev) => {
        callback(featureHelpers.properties(ev.target))
    })
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
