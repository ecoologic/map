import React, {useContext, useState} from 'react'
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import {MapContext} from "./Map";
import {identity, useMount} from "../utils";
import { styles } from './styles';

const hoverLayer = new VectorLayer({
    source: new VectorSource(),
    style: styles.filledGreen
})

let hoveredFeature;
const updateHoveredFeature = (feature) => {
    const source = hoverLayer.getSource()

    if (hoveredFeature) { source.removeFeature(hoveredFeature) }
    if (feature) { source.addFeature(feature) }

    hoveredFeature = feature
}

// TODO? MapHoverContext
export const HoverContext = React.createContext({})
export const HoverProvider = ({ children }) => {
    // console.debug(`Render HoverProvider`)
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

export const HoveredCountry = () => {
    // console.debug(`Render HoveredCountry`)
    const {featureData} = useContext(HoverContext);
    return <div>Country: {featureData.name}</div>
}
