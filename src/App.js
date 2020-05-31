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

//////////////////////////////////////// fetch

const useFetch = (url, options) => {
    const {whileSpinning} = React.useContext(SpinnerContext);
    const fetchData = async () => {
        try {
            const rawResponse = await fetch(url, options);
            const responseJson = await rawResponse.json();
            setTimeout(() => { setResponse(responseJson); }, 1000)
        } catch (error) {
            console.warn('fetch error', error);
            setResponse({ error });
        }
    };
    const [response, setResponse] = React.useState({});
    React.useEffect(() => { whileSpinning(fetchData) }, [url, options]);
    return response;
};

// TODO: row exception catcher

////////////////////////////////////////// spinner

export const SpinnerContext = React.createContext({});
export const SpinnerProvider = ({ children }) => {
    const { isSpinning, whileSpinning } = useSpinner();

    return <SpinnerContext.Provider value={{ isSpinning, whileSpinning }}>
        {children}
    </SpinnerContext.Provider>
}

const useSpinner = (startSpinning = false) => {
    const [isSpinning, setIsSpinning] = React.useState(startSpinning);
    const whileSpinning = async (callback) => {
        try {
            setIsSpinning(true)
            return await callback()
        } finally {
            setIsSpinning(false)
        }
    }

    return { isSpinning, whileSpinning }
}

const Spinner = () => <i className="text-gray">Loading...</i>;

/////////////////////////////////////////////////////// app

const Flag = () => {
    const {records} = React.useContext(ClickRecordContext);
    const record = records[records.length - 1] || ClickRecordContext.emptyFeaturesData;
    const country = record.featuresData[0];
    const response = useFetch(`https://restcountries.eu/rest/v2/name/${country.name}?fullText=true`)
    const {isSpinning} = React.useContext(SpinnerContext);

    return isSpinning
        ? <Spinner />
        : response[0]
            ? <img src={response[0]?.flag} alt={`${country.name} flag`} height="100px" />
            : <span className="h-100px inline-block">{response.error || response.message}</span>
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
