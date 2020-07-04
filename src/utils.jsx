import React from 'react'

export const EVENTS = {
  error: (where, ...params) => {
      console.info('Error', where, params);
  }
}

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


///////////////////////////// ErrorBoundary
// https://reactjs.org/docs/error-boundaries.html
export class ErrorBoundary extends React.Component {
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  componentDidCatch(error, errorInfo) {
    EVENTS.error('ErrorBoundary#componentDidCatch', error, errorInfo)
  }
  render() {
    if (this.state.hasError) {
      return <i className='text-gray'>[N/A]</i>;
    } else {
      return this.props.children;
    }
  }
}


///////////////////////////// Td
export const Td = ({children, ...props}) => {
  return <ErrorBoundary>
    <td {...props}>{children}</td>
  </ErrorBoundary>
}


///////////////////////////// useMount
export const useMount = (subjectName, mount, unmount = identity) => {
  const init = () => {
    console.debug('useMount-init', subjectName)
    mount()
    return () => {
      console.debug('useMount/unmount', subjectName)
      unmount()
    }
  }
  React.useEffect(init, [])
}


//////////////////////////////////////// useFetch
const safeFetch = async (url, options) => {
  try {
    const rawResponse = await fetch(url, options);
    console.info('useFetch', url, options);
    const responseJson = await rawResponse.json();
    // console.info('useFetch response', url, options, responseJson);
    return responseJson;
  } catch (error) {
    EVENTS.error('useFetch/catch', error);
    return { error };
  }
};
export const useFetch = (url, options) => {
  const {whileSpinning} = React.useContext(SpinnerContext);
  const [response, setResponse] = React.useState({});
  React.useEffect(() => {
    whileSpinning(async () => {
      const response = await safeFetch(url, options);
      setResponse(response);
    })
  }, [url, options]);
  return response;
};


///////////////////////////// useSpinner
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


///////////////////////////// useShortcut
export const useShortcut = (key, callback) => {
  const handler = (event) => {
    if(key === event.key) {
      event.preventDefault();
      callback(event);
    }
  }
  useMount('useShortcut', () => {
    document.addEventListener('keydown', handler);
  }, () => {
    document.removeEventListener('keydown', handler);
  })
}


///////////////////////////// useToggle
// export const useToggle = (initialState) => {
//   const [value, setValue] = React.useState(initialState);
//   const toggle = () => setValue(!value);
//   return { value, setValue, toggle };
// }
