import React, {useEffect, useContext} from 'react'

export const identity = (args) => args

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

export const useMount = (subjectName, mount, unmount = identity) => {
    const init = () => {
        console.log(`Mount  ${subjectName}`)
        mount()
        return () => {
            console.log(`Unmount ${subjectName}`)
            unmount()
        }
    }
    useEffect(init, [])
}

// export const safeAnew = (base, newProperties) => Object.assign((base || {}), newProperties)
