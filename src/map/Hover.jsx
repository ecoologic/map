import React, {useContext, useState} from 'react'
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Style from "ol/style/Style";
import Fill from "ol/style/Fill";
import {MapContext} from "./Map";
import {identity, useMount} from "../utils";

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
    // console.log(`Render HoverProvider`)
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
    // console.log(`Render HoveredCountry`)
    const {featureData} = useContext(HoverContext);
    return <div>Country: {featureData.name}</div>
}

