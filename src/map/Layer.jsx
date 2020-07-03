import React, {useState, useContext, useRef} from 'react'
import {featureHelpers, MapContext} from './Map';
import {useMount} from '../utils'
import GeoJSON from "ol/format/GeoJSON";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";

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
  startVisible: true
})
export const CitiesContext = React.createContext({
  name: "cities",
  geoJsonPath: './data/worldcities.geojson',
  startVisible: false
})

export const LayerProvider = ({ context, children }) => {
  console.debug(`Render LayerProvider`)
  const { name, geoJsonPath, startVisible } = useContext(context)
  const { addLayer, removeLayer } = useContext(MapContext)
  const [isVisible, setIsVisible] = useState(!!startVisible)
  const subject = useRef(layerHelpers.create(name, geoJsonPath)).current
  const onChangeCallback = (isVisible) => {
    subject.setVisible(isVisible)
    setIsVisible(isVisible)
  }
  const Provider = context.Provider

  useMount('LayerProvider', () => {
    subject.setVisible(startVisible)
    addLayer(subject)
  }, () => removeLayer(subject))

  const value = { name, isVisible, onChangeCallback }
  return <Provider value={value}>{children}</Provider>
}
