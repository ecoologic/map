import React, {useEffect, useState, useRef, useContext} from 'react'
import {featureHelpers, MapContext} from './map';
import {unmount} from '../utils'

// OL 6: https://openlayers.org/en/latest/examples/vector-tile-selection.html?q=mouse+position
const ol = window.ol

const format = new ol.format.GeoJSON()

const layerHelpers = {
    create: (layerName, url) => {
        // overlaps: false for performance, see: https://openlayers.org/en/latest/apidoc/module-ol_source_Vector-VectorSource.html
        const source = new ol.source.Vector({ url, format, overlaps: false })
        source.once('change', () => featureHelpers.init(source.getFeatures(), { layerName }))
        return new ol.layer.Vector({ source, className: layerName })
    }
}

export const CountriesContext = React.createContext({
    name: "countries",
    geoJsonPath: './data/countries.geojson',
    startActive: true
})
export const CitiesContext = React.createContext({
    name: "cities",
    geoJsonPath: './data/worldcities.geojson',
    startActive: false
})

export const LayerProvider = ({ context, children }) => {
    const { name, geoJsonPath, startActive } = useContext(context)
    const { addLayer, removeLayer } = useContext(MapContext)
    const [isActive, setIsActive] = useState(!!startActive)
    const subject = useRef(layerHelpers.create(name, geoJsonPath)).current
    const onChangeCallback = (isVisible) => subject.setVisible(isVisible)
    const Provider = context.Provider

    useEffect(() => {
        console.log('Mounting LayerProvider')
        subject.setVisible(startActive)
        addLayer(subject)

        return unmount('LayerProvider', () => removeLayer(subject))
    }, [startActive, subject, addLayer, removeLayer])

    const value = { name, isActive, setIsActive, onChangeCallback }
    return <Provider value={value}>{children}</Provider>
}
