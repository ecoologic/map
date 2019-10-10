export const anew = (base, newProperties) => Object.assign({}, base, newProperties)
export const safeAnew = (base, newProperties) => anew((base || {}), newProperties)
