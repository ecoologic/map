import {useEffect} from 'react'

export const useMount = (subjectName, mount, unmount) => {
    useEffect(() => {
        console.log(`Mounting   ${subjectName}`)
        mount()
        return () => {
            console.log(`Unmounting ${subjectName}`)
            unmount()
        }
    }, [])
}

// export const safeAnew = (base, newProperties) => Object.assign((base || {}), newProperties)
// export const identity = (args) => args
