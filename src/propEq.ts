type returnVal = (obj: { [key: string]: any }) => boolean

const propEq = (prop: string, value: number | string): returnVal => obj => obj[prop] === value

export default propEq
