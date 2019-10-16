// TODO: restructure files by DOMAIN
// TODO: pass params from provider
// TODO: import paths relative to root
// TODO: why I need to define every function in MapProvider?
// TODO: licence
// TODO: header and footer
// TODO: some CSS FFS
// https://jsfiddle.net/AliBassam/eyepyzrp/
// var newParent = document.getElementById('new-parent');
// var oldParent = document.getElementById('old-parent');
//
// while (oldParent.childNodes.length > 0) {
//     newParent.appendChild(oldParent.childNodes[0]);
// }
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
    const {name, isActive, onChangeCallback} = useContext(context);
    const onChange = (ev) => onChangeCallback(ev.target.checked);

    return <label>
        {name}:
        <input type="checkbox" checked={isActive} onChange={onChange}/>
    </label>
};

const ActivatableContext = ({Provider, Context}) => {
    return <Provider context={Context}>
        <p><ActivationCheckbox context={Context}/></p>
    </Provider>
};

const App = ({map}) => {
    return <MapProvider map={map}>
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
