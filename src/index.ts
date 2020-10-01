type returnVal = (obj: { [key: string]: any }) => boolean

export const propEq = (prop: string, value: number | string): returnVal => obj => obj[prop] === value
