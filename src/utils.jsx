import {useEffect} from 'react'

export const identity = (args) => args

export const useMount = (subjectName, mount, unmount = identity) => {
    const init = () => {
        console.log(`Mounting   ${subjectName}`)
        mount()
        return () => {
            console.log(`Unmounting ${subjectName}`)
            unmount()
        }
    }
    useEffect(init, [])
}

// export const safeAnew = (base, newProperties) => Object.assign((base || {}), newProperties)
