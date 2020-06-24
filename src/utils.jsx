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

// export const useToggle = (initialState) => {
//     const [value, setValue] = React.useState(initialState);
//     const toggle = () => setValue(!value);
//     return { value, setValue, toggle };
// }

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

// TODO: row exception catcher
// TODO: row-map two way binding
