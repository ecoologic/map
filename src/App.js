// TODO: restructure files by DOMAIN
// TODO: error boundary
// TODO: pass params from provider
// TODO: lat/lon like mouse control
import React, {useContext} from 'react'
import {MapProvider} from './map/map'
import {
    LayerProvider,
    CountriesContext,
    CitiesContext,
    HoverContext,
    HoverProvider,
} from './map/layers'
import {ViewContext, ViewProvider} from './map/view';
import {
    ClickRecordProvider,
    useClickRecorded,
} from './map/interactions';
import {MouseContext, MouseProvider} from './map/controls';

const ViewCenter = () => {
    const {center} = useContext(ViewContext);
    const [x, y] = center.map((n) => Math.round(n * 10000) / 10000);

    return <div>View Center: {x}, {y}</div>
};

const HoveredCountry = () => {
    const {featureData} = useContext(HoverContext);
    return <div>Country: {featureData.name}</div>
};

const Records = () => {
    const {records} = useClickRecorded();
    return <ol>
        {records.map((record, i) =>
            <li key={i}>{record.featuresData.map(fd => fd.title).join(', ')}</li>)}
    </ol>
};

const ActivationCheckbox = ({context}) => {
    const {name, isActive, setIsActive, onChangeCallback} = useContext(context);
    const onChange = (ev) => {
        setIsActive(ev.target.checked);
        onChangeCallback(ev.target.checked, ev)
    };

    return <label>
        {name}:
        <input type="checkbox" checked={isActive} onChange={onChange}/>
    </label>
};

const ActivatableContext = ({Provider, Context}) => {
    return <Provider context={Context}>
        <ActivationCheckbox context={Context}/>
    </Provider>
};

const App = () => {
    return <MapProvider>
        <ViewProvider>
            <ViewCenter/>
        </ViewProvider>

        <ActivatableContext Provider={LayerProvider} Context={CountriesContext}/>
        <ActivatableContext Provider={LayerProvider} Context={CitiesContext}/>
        <ActivatableContext Provider={MouseProvider} Context={MouseContext}/>

        <HoverProvider>
            <HoveredCountry />
        </HoverProvider>

        <ClickRecordProvider>
            <Records/>
        </ClickRecordProvider>
    </MapProvider>
};

export default App
