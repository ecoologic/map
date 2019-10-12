import React, {useEffect, useState, useRef, useContext} from 'react'
import {MapContext} from './map'
import {unmount} from "../utils";

const ol = window.ol

const projection = 'EPSG:4326'
const undefinedHTML = '&nbsp;'

const mousePosition = () => new ol.control.MousePosition({
    coordinateFormat: ol.coordinate.createStringXY(4),
    projection,
    undefinedHTML })

export const MouseContext = React.createContext({ name: 'mouse', startActive: true })
export const MouseProvider = ({ children }) => {
    const { name, startActive } = useContext(MouseContext)
    const { addControl, removeControl } = useContext(MapContext)
    const [isActive, setIsActive] = useState(!!startActive)
    const subject = useRef(mousePosition()).current
    const onChangeCallback = (newValue) => newValue ? addControl(subject) : removeControl(subject)

    useEffect(() => {
        console.log('Mounting   MouseProvider')
        if(startActive) addControl(subject)

        return unmount('MouseProvider', () => removeControl(subject))
    }, [startActive, subject, addControl, removeControl])

    const value = { name, isActive, setIsActive, onChangeCallback }
    return <MouseContext.Provider value={value}>{children}</MouseContext.Provider>
}
