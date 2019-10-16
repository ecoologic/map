import React, {useContext, useReducer} from 'react';
import {featureHelpers, MapContext} from './Map';
import {useMount} from "../utils";
import Select from "ol/interaction/Select";
import {click} from "ol/events/condition";

const clickSelect = new Select({ condition: click })

const onSelectFeature = (select, callback) => {
    select.on('select', (ev) => {
        callback(featureHelpers.properties(ev.target))
    })
}

export const ClickRecordContext = React.createContext([])
export const ClickRecordProvider = ({ children }) => {
    console.debug(`Render ClickRecordProvider`)
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

export const useClickRecord = () => {
    console.debug(`Render useClickRecord`)
    const { addInteraction, removeInteraction } = useContext(MapContext)
    const { records, addClickRecord } = useContext(ClickRecordContext)
    const select = clickSelect

    useMount('useClickRecord', () => {
        onSelectFeature(select, (featuresData) => addClickRecord({ featuresData }))
        addInteraction(select)
    }, () => removeInteraction(select))

    return { records }
}

export const Records = () => {
    console.debug(`Render Records`)
    const {records} = useClickRecord();
    return <ol>
        {records.map((record, i) =>
            <li key={i}>{record.featuresData.map(fd => fd.title).join(', ')}</li>)}
    </ol>
}
