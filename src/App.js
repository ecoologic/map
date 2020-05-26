import React from 'react'
import {MapProvider} from './map/Map'
import {
    LayerProvider,
    CountriesContext,
    CitiesContext,
} from './map/Layer'
import {ViewCenter, ViewProvider} from './map/View';
import {
    ClickRecordProvider, ClickRecordContext, Records,
} from './map/ClickRecord';
import {MousePositionContext, MousePositionProvider} from './map/MousePosition';
import {HoveredCountry, HoverProvider} from "./map/Hover";
import {ActivatableContext} from "./utils";

const useFetch = (url, options) => {
    const fetchData = async () => {
        try {
            const rawResponse = await fetch(url, options);
            const responseJson = await rawResponse.json();
            setResponse(responseJson);
        } catch (error) {
            console.warn('fetch error', error);
            setResponse({ error });
        }
    };
    const [response, setResponse] = React.useState({});
    React.useEffect(() => { fetchData() }, [url, options]);
    return response;
};

const Flag = () => {
    const {records} = React.useContext(ClickRecordContext);
    const record = records[records.length - 1] || { featuresData: [{}] };
    const country = record.featuresData[0];
    const response = useFetch(`https://restcountries.eu/rest/v2/name/${country.name}?fullText=true`)
    if(response[0]) {
        return <img src={response[0]?.flag} alt={`${country.name} flag`} height="100px" />
    } else {
        return <span className="h-100px">{response.error || response.message}</span>
    }
}

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
                    <Flag />
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
