// TODO: rename ClickRecordProvider
import React, {useContext, useReducer} from 'react';
import {featureHelpers, MapContext} from './map';
import {useMount} from "../utils";
import Select from "ol/interaction/Select";
import {click} from "ol/events/condition";

const clickSelect = new Select({ condition: click })

const onSelectFeature = (select, callback) => {
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
        onSelectFeature(select, (featuresData) => addClickRecord({ featuresData }))
        addInteraction(select)
    }, () => removeInteraction(select))

    return { records }
}
