import React from 'react'
import {Map} from 'ol';
import {view} from './View'
import {Tile} from "ol/layer";
import OSM from "ol/source/OSM";

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

const map = new Map({ target: 'map' })
const openStreetMapLayer = new Tile({ source: new OSM() })

export const MapContext = React.createContext({})
export const MapProvider = ({ children }) => {
    console.log(`Render MapProvider`)
    const on = (eventName, callback) => map.on(eventName, callback)
    const getEventPixel = (pixel) => map.getEventPixel(pixel)
    const forEachFeatureAtPixel = (pixel, callback, opt_options) => map.forEachFeatureAtPixel(pixel, callback, opt_options)

    const addInteraction = (select) => map.addInteraction(select)
    const removeInteraction = (select) => map.removeInteraction(select)

    const addLayer = (layer) => map.addLayer(layer)
    const removeLayer = (layer) => map.removeLayer(layer)

    const addControl = (control) => map.addControl(control)
    const removeControl = (control) => map.removeControl(control)

    map.setView(view)
    addLayer(openStreetMapLayer)

    const value = {
        on, getEventPixel, forEachFeatureAtPixel,
        addLayer, removeLayer,
        addControl, removeControl,
        addInteraction, removeInteraction }
    return <MapContext.Provider value={value}>{children}</MapContext.Provider>
}
