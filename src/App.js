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
import {ActivatableContext, SpinnerProvider} from "./utils";
import { Flag } from './Flag';

const App = () => {
    return <>
        <header className="header">
            A Basic Map By Ecoologic
        </header>
        <MapProvider>
            <ViewProvider>
                <ViewCenter />
            </ViewProvider>
            <ActivatableContext Provider={LayerProvider} Context={CountriesContext} />
            <ActivatableContext Provider={LayerProvider} Context={CitiesContext} />
            <ActivatableContext Provider={MousePositionProvider} Context={MousePositionContext} />
            <HoverProvider>
                <HoveredCountry />
                <ClickRecordProvider>
                    <SpinnerProvider>
                        <Flag />
                    </SpinnerProvider>
                    <Records />
                </ClickRecordProvider>
            </HoverProvider>
        </MapProvider>
        <footer className="footer">
            Happy coding!
        </footer>
    </>
};

export default App
