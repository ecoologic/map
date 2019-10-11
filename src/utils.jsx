export const safeAnew = (base, newProperties) => Object.assign((base || {}), newProperties)

export const identity = (args) => args

export const unmount = (subject, callback = identity) => {
    return () => {
        console.log(`Unmounting ${subject}`)
        return callback()
    }
}
