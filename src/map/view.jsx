import React, {useContext, useReducer} from "react"
import {MapContext} from './map'
import {useMount} from "../utils";

const ol = window.ol;

const initialLonLat = [37.41, 48.82]; // (x, y) Au: [140.0, -25.0]

export const view = new ol.View({ center: ol.proj.fromLonLat(initialLonLat), zoom: 3 });

export const ViewContext = React.createContext({})
export const ViewProvider = ({ children }) => {
    const { on } = useContext(MapContext)

    const reducer = (state, action) => { // could be done with useState
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
