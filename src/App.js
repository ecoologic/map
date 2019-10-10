// TODO: error boundary

import React, {useContext} from 'react'
import {MapProvider} from './map/map'
import {LayerProvider, CountriesContext, CitiesContext} from './map/layers'
import {MapViewContext, MapViewProvider} from './map/view';
import {
  ClickRecordProvider,
  useClickRecorded,
  HoverContext,
  HoverProvider,
} from './map/interactions';
import {MouseContext, MouseProvider} from './map/controls';

// TODO: round
const MapCenter = () => {
  const { center } = useContext(MapViewContext)
  return <div>View Position: {center[0]} {center[1]}</div>
}
const MapCountry = () => {
  const { featureData } = useContext(HoverContext)
  return <div>Country: {featureData.name}</div>
}
// TODO: Map prefix?? or Center, Country, Records
const Records = () => {
  const { records } = useClickRecorded()
  return <ol>
    {records.map((record, i) =>
        <li key={i}>{record.featuresData.map(fd => fd.name).join(', ')}</li>)}
  </ol>
}

const ActivationCheckbox = ({ context }) => {
  const { name, isActive, setIsActive, onChangeCallback } = useContext(context)
  const onChange = (ev) => {
    setIsActive(ev.target.checked)
    onChangeCallback(ev.target.checked, ev)
  }

  return <label>
    {name}:
    <input type="checkbox" checked={isActive} onChange={onChange} />
  </label>
}
const ActivatableContext = ({Provider, Context}) => {
  return <Provider context={Context}>
    <ActivationCheckbox context={Context} />
  </Provider>
}

const App = () => {
  return <MapProvider>
      <MapViewProvider>
        <MapCenter />
      </MapViewProvider>

      <ActivatableContext Provider={LayerProvider} Context={CountriesContext} />
      <ActivatableContext Provider={LayerProvider} Context={CitiesContext} />
      <ActivatableContext Provider={MouseProvider} Context={MouseContext} />

      <HoverProvider>
        <MapCountry />
      </HoverProvider>

      <ClickRecordProvider>
        <Records />
      </ClickRecordProvider>
    </MapProvider>
}

export default App
