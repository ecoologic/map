import React, {useContext} from 'react'

export const ActivationCheckbox = ({context}) => {
    const {name, isVisible, onChangeCallback} = useContext(context);
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

