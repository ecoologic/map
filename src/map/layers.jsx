// TODO: CountriesProvider, CitiesProvider, HoverProvider
import React, {useState, useContext, useRef} from 'react'
import {featureHelpers, MapContext} from './map';
import {identity, useMount} from '../utils'
import GeoJSON from "ol/format/GeoJSON";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import Style from "ol/style/Style";
import Fill from "ol/style/Fill";

const format = new GeoJSON()

const layerHelpers = {
    create: (layerName, url) => {
        // overlaps: false for performance, see: https://openlayers.org/en/latest/apidoc/module-ol_source_Vector-VectorSource.html
        const source = new VectorSource({ url, format, overlaps: false })
        source.once('change', () => featureHelpers.init(source.getFeatures(), { layerName }))
        return new VectorLayer({ source, className: layerName })
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

// TODO: active -> visible
export const LayerProvider = ({ context, children }) => {
    const { name, geoJsonPath, startActive } = useContext(context)
    const { addLayer, removeLayer } = useContext(MapContext)
    const [isActive, setIsActive] = useState(!!startActive)
    const subject = useRef(layerHelpers.create(name, geoJsonPath)).current
    const onChangeCallback = (isVisible) => {
        subject.setVisible(isVisible)
        setIsActive(isVisible)
    }
    const Provider = context.Provider

    useMount('LayerProvider', () => {
        subject.setVisible(startActive)
        addLayer(subject)
    }, () => removeLayer(subject))

    const value = { name, isActive, onChangeCallback }
    return <Provider value={value}>{children}</Provider>
}

//////////////////////////////////////////////////////////////////////////////
// Hover

const hoverLayer = new VectorLayer({
    source: new VectorSource(),
    style: new Style({ fill: new Fill({ color: 'rgba(0,255,0,0.1)' }) })
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
    const { addLayer, removeLayer, on, getEventPixel, forEachFeatureAtPixel } = useContext(MapContext)
    const [featureData, setFeatureData] = useState({})

    useMount('HoverProvider', () => {
        on('pointermove', function(ev) {
            if (ev.dragging) { return }

            const pixel = getEventPixel(ev.originalEvent)
            const feature = forEachFeatureAtPixel(pixel, identity)
            if (feature === hoveredFeature || !feature) { return }

            updateHoveredFeature(feature)
            setFeatureData(feature.getProperties())
        })
        addLayer(hoverLayer)
    }, () => removeLayer(hoverLayer))

    const value = { featureData }
    return <HoverContext.Provider value={value}>{children}</HoverContext.Provider>
}
