import React, {useState, useContext} from 'react'
import {MapContext} from './Map'
import {useMount} from "../utils";
import MousePosition from "ol/control/MousePosition";
import {createStringXY} from "ol/coordinate";

const undefinedHTML = '&nbsp;'

const mousePosition = new MousePosition({
  coordinateFormat: createStringXY(4),
  undefinedHTML })

export const MousePositionContext = React.createContext({ name: 'mouse', startVisible: true })
export const MousePositionProvider = ({ children }) => {
  const { name, startVisible } = useContext(MousePositionContext)
  const { addControl, removeControl } = useContext(MapContext)
  const [isVisible, setIsVisible] = useState(!!startVisible)
  const subject = mousePosition
  const onChangeCallback = (newValue) => {
    setIsVisible(newValue)
    newValue ? addControl(subject) : removeControl(subject)
  }

  useMount('MousePositionProvider', () => {
    if (startVisible) addControl(subject)
  }, () => removeControl(subject))

  const value = { name, isVisible, setIsVisible, onChangeCallback }
  return <MousePositionContext.Provider value={value}>{children}</MousePositionContext.Provider>
}
