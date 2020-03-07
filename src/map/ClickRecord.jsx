import React, {useContext, useReducer} from 'react';
import {featureHelpers, MapContext} from './Map';
import {useMount} from "../utils";
import Select from "ol/interaction/Select";
import {click} from "ol/events/condition";
import {HoverContext} from "./Hover";

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

const FeaturedTr = ({ ol_uid, children }) => {
    console.debug(`Render FeaturedTr`)
    const hoveredOlUid = useContext(HoverContext).featureData?.geometry?.ol_uid;
    const highlighted = hoveredOlUid === ol_uid;
    return <tr className={highlighted ? 'highlighted' : '' }>{children}</tr>
}

export const Records = () => {
    console.debug(`Render Records`)
    const {records} = useClickRecord();
    return <table><tbody>
        {records.map((record) =>
            <FeaturedTr key={record.featuresData[0].geometry.ol_uid}
                        ol_uid={record.featuresData[0].geometry.ol_uid}>
                <td>{record.featuresData.map((fd) => fd.title).join(', ')}</td>
            </FeaturedTr>
            )}
    </tbody></table>
}
