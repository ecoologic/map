import React, {useRef} from 'react'
import {anew} from './utils';

const ol = window.ol

export const featureHelpers = {
    properties: (withFeatures) => withFeatures.getFeatures()
                                              .getArray()
                                              .map(f => f.getProperties()),
    init: (features, data) => {
        features.forEach((feature) => {
            const field = {
                cities: 'label',
                countries: 'name'
            }[data.layerName]
            feature.setProperties(anew(data, { name: feature.get(field) }), false)
        })
    }
}

const initialLonLat = [37.41, 48.82] // (x, y) Au: [140.0, -25.0]

export const MapContext = React.createContext({})
export const MapProvider = ({ children }) => {
    const map = document._map
    const on = (eventName, callback) => map.on(eventName, callback)
    const view = useRef(new ol.View({ center: ol.proj.fromLonLat(initialLonLat), zoom: 4 })).current
    // TODO: useView OR define in document._map

    const addInteraction = (select) => map.addInteraction(select)

    const addLayer = (layer) => map.addLayer(layer)
    const removeLayer = (layer) => map.removeLayer(layer)

    const addControl = (control) => map.addControl(control)
    const removeControl = (control) => map.removeControl(control)

    useRef(map.setView(view)) // Done sync, as opposed to useEffect
    useRef(addLayer(new ol.layer.Tile({ source: new ol.source.OSM() })))

    const value = {
        view, on, // TODO: don't expose view??
        addLayer, removeLayer,
        addControl, removeControl,
        addInteraction }
    return <MapContext.Provider value={value}>{children}</MapContext.Provider>
}
