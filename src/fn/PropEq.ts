type returnVal = (obj: { [key: string]: any }) => boolean

const PropEq = (prop: string, value: number | string): returnVal => obj => obj[prop] === value

export default PropEq
