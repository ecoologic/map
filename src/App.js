import React from 'react'
import {MapProvider} from './map/Map'
import {
    LayerProvider,
    CountriesContext,
    CitiesContext,
} from './map/Layer'
import {ViewCenter, ViewProvider} from './map/View';
import {
    ClickRecordProvider, Records,
} from './map/ClickRecord';
import {MousePositionContext, MousePositionProvider} from './map/MousePosition';
import {HoveredCountry, HoverProvider} from "./map/Hover";
import {ActivatableContext} from "./utils/Activatable";

const App = () => {
    return <MapProvider>
        <ViewProvider>
            <ViewCenter />
        </ViewProvider>

        <ActivatableContext Provider={LayerProvider} Context={CountriesContext}/>
        <ActivatableContext Provider={LayerProvider} Context={CitiesContext}/>
        <ActivatableContext Provider={MousePositionProvider} Context={MousePositionContext}/>

        <HoverProvider>
            <HoveredCountry />
        </HoverProvider>

        <ClickRecordProvider>
            <Records/>
        </ClickRecordProvider>
    </MapProvider>
};

export default App
