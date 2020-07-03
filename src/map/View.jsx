import React, {useContext, useReducer} from "react"
import {MapContext} from './Map'
import {useMount} from "../utils";
import {fromLonLat} from "ol/proj";
import View from "ol/View";

const initialLonLat = [37.41, 48.82]; // (x, y) Au: [140.0, -25.0]

export const view = new View({ center: fromLonLat(initialLonLat), zoom: 3 });

export const ViewContext = React.createContext({})
export const ViewProvider = ({ children }) => {
  console.debug(`Render ViewProvider`)
  const { on } = useContext(MapContext)

  const reducer = (state, action) => {
    switch (action.type) {
      case 'MOVE_END':
        return { ...state, center: state.view.getCenter() }
      default:
        return state
    }
  }

  const center = view.getCenter()
  const moveEnd = () => dispatch({ type: 'MOVE_END' })

  const [value, dispatch] = useReducer(reducer, { view, center, moveEnd })

  useMount('ViewProvider', () => { on('moveend', moveEnd) })

  return <ViewContext.Provider value={value}>{children}</ViewContext.Provider>
}

export const ViewCenter = () => {
  console.debug(`Render ViewCenter`)
  const {center} = useContext(ViewContext);
  const [x, y] = center.map((n) => Math.round(n * 10000) / 10000);

  return <div>View Center: {x}, {y}</div>
}
