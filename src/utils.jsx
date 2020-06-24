import React from 'react'

export const identity = (args) => args

export const ActivationCheckbox = ({context}) => {
    const {name, isVisible, onChangeCallback} = React.useContext(context);
    const onChange = (ev) => onChangeCallback(ev.target.checked);

    return <label>
        {name}:
        <input type="checkbox" checked={isVisible} onChange={onChange}/>
    </label>
}

export const ActivatableContext = ({Provider, Context}) => {
    return <Provider context={Context}>
        <p><ActivationCheckbox context={Context}/></p>
    </Provider>
}

export const useMount = (subjectName, mount, unmount = identity) => {
    const init = () => {
        console.debug(`Mount  ${subjectName}`)
        mount()
        return () => {
            console.debug(`Unmount ${subjectName}`)
            unmount()
        }
    }
    React.useEffect(init, [])
}

//////////////////////////////////////// Fetch

export const useFetch = (url, options) => {
    const {whileSpinning} = React.useContext(SpinnerContext);
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
    React.useEffect(() => { whileSpinning(fetchData) }, [url, options]);
    return response;
};

////////////////////////////////////////// Spinner

export const SpinnerContext = React.createContext({});
export const SpinnerProvider = ({ children }) => {
    const { isSpinning, whileSpinning } = useSpinner();

    return <SpinnerContext.Provider value={{ isSpinning, whileSpinning }}>
        {children}
    </SpinnerContext.Provider>
}

export const useSpinner = (startSpinning = false) => {
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

export const Spinner = () => <i className="text-gray">Loading...</i>;

// export const useToggle = (initialState) => {
//     const [value, setValue] = React.useState(initialState);
//     const toggle = () => setValue(!value);
//     return { value, setValue, toggle };
// }


////////////////////////////// Errors

// // https://reactjs.org/docs/error-boundaries.html
export class ErrorBoundary extends React.Component {
    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }
    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        console.log(error, errorInfo);
    }
    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return <i>Something went wrong</i>;
        } else {
            return this.props.children;
        }
    }
}

// TODO: Event (or Log)
