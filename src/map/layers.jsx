import React, {useState, useContext} from 'react'
import {featureHelpers, MapContext} from './map';
import {identity, useMount} from '../utils'

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
    const subject = layerHelpers.create(name, geoJsonPath)
    const onChangeCallback = (isVisible) => subject.setVisible(isVisible)
    const Provider = context.Provider

    useMount('LayerProvider', () => {
        subject.setVisible(startActive)
        addLayer(subject)
    }, () => removeLayer(subject))

    const value = { name, isActive, setIsActive, onChangeCallback }
    return <Provider value={value}>{children}</Provider>
}

//////////////////////////////////////////////////////////////////////////////
// Hover

const hoverLayer = new ol.layer.Vector({
    source: new ol.source.Vector(),
    style: new ol.style.Style({ fill: new ol.style.Fill({ color: 'rgba(0,255,0,0.1)' }) })
})

let hoveredFeature;
const updateHoveredFeature = (feature) => {
    const source = hoverLayer.getSource()

    if (hoveredFeature) { source.removeFeature(hoveredFeature) }
    if (feature) { source.addFeature(feature) }

    hoveredFeature = feature
}

export const HoverContext = React.createContext({})
export const HoverProvider = ({ children }) => {
    const { addLayer, removeLayer } = useContext(MapContext)
    const [featureData, setFeatureData] = useState({})

    useMount('HoverProvider', () => {
        document._map.on('pointermove', function(ev) {
            if (ev.dragging) { return }
            const pixel = document._map.getEventPixel(ev.originalEvent)
            const feature = document._map.forEachFeatureAtPixel(pixel, identity)
            if (feature === hoveredFeature || !feature) { return }

            updateHoveredFeature(feature)
            const featureData = feature.getProperties();
            setFeatureData(featureData || {})
        });
        addLayer(hoverLayer)
    }, () => removeLayer(hoverLayer))

    const value = { featureData }
    return <HoverContext.Provider value={value}>{children}</HoverContext.Provider>
}
