// TODO: rename MousePosition
import React, {useState, useContext} from 'react'
import {MapContext} from './map'
import {useMount} from "../utils";

const ol = window.ol

const undefinedHTML = '&nbsp;'

const mousePosition = new ol.control.MousePosition({
    coordinateFormat: ol.coordinate.createStringXY(4),
    undefinedHTML })

export const MouseContext = React.createContext({ name: 'mouse', startActive: true })
export const MouseProvider = ({ children }) => {
    const { name, startActive } = useContext(MouseContext)
    const { addControl, removeControl } = useContext(MapContext)
    const [isActive, setIsActive] = useState(!!startActive)
    const subject = mousePosition
    const onChangeCallback = (newValue) => {
        setIsActive(newValue)
        newValue ? addControl(subject) : removeControl(subject)
    }

    useMount('MouseProvider', () => {
        if (startActive) addControl(subject)
    }, () => removeControl(subject))

    const value = { name, isActive, setIsActive, onChangeCallback }
    return <MouseContext.Provider value={value}>{children}</MouseContext.Provider>
}
