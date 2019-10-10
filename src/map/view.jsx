import React, {useContext, useEffect, useReducer} from "react"
import {MapContext} from './map'
import {anew} from './utils';

export const MapViewContext = React.createContext({})
export const MapViewProvider = ({ children }) => {
    const { on, view } = useContext(MapContext)

    const reducer = (state, action) => { // could be done with useState
        switch (action.type) {
            case 'MOVE_END':
                return anew(state, { center: state.view.getCenter() })
            default:
                return state
        }
    }

    const center = view.getCenter()
    const moveEnd = () => dispatch({ type: 'MOVE_END' })

    const [value, dispatch] = useReducer(reducer, { view, center, moveEnd })

    const init = () => { on('moveend', moveEnd) }
    useEffect(init, [])

    return <MapViewContext.Provider value={value}>{children}</MapViewContext.Provider>
}
