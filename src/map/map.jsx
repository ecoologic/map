// TODO: hot reload broken???

import React from 'react'
import {view} from './view'

const ol = window.ol;

export const featureHelpers = {
    properties: (withFeatures) => withFeatures.getFeatures()
                                              .getArray()
                                              .map(f => f.getProperties()),
    // Ensures every layer feature has a "title" property
    init: (features, data) => {
        features.forEach((feature) => {
            const field = {
                cities: 'label',
                countries: 'name'
            }[data.layerName]
            feature.setProperties({ ...data, title: feature.get(field) }, false)
        })
    }
}

const openStreetMapLayer = new ol.layer.Tile({ source: new ol.source.OSM() })

export const MapContext = React.createContext({})
export const MapProvider = ({ children }) => {
    const map = document._map
    const on = (eventName, callback) => map.on(eventName, callback)

    const addInteraction = (select) => map.addInteraction(select)
    const removeInteraction = (select) => map.removeInteraction(select)

    const addLayer = (layer) => map.addLayer(layer)
    const removeLayer = (layer) => map.removeLayer(layer)

    const addControl = (control) => map.addControl(control)
    const removeControl = (control) => map.removeControl(control)

    map.setView(view)
    addLayer(openStreetMapLayer)

    const value = {
        on,
        addLayer, removeLayer,
        addControl, removeControl,
        addInteraction, removeInteraction }
    return <MapContext.Provider value={value}>{children}</MapContext.Provider>
}
