export const Encrypt = (Text: string): string => {
  let output = ''
  const alterText: any[] = []
  const varCost: any[] = []
  const TextSize = Text.length
  for (let i = 0; i < TextSize; i++) {
    const idea = Math.round(Math.random() * 111) + 77
    alterText[i] = Text.charCodeAt(i) + idea
    varCost[i] = idea
  }
  for (let i = 0; i < TextSize; i++) {
    output += String.fromCharCode(alterText[i], varCost[i])
  }
  return output
}
export const UnEncrypt = (Text: string): string => {
  let output = ''
  const alterText: any[] = []
  const varCost: any[] = []
  const TextSize = Text.length
  for (let i = 0; i < TextSize; i++) {
    alterText[i] = Text.charCodeAt(i)
    varCost[i] = Text.charCodeAt(i + 1)
  }
  for (let i = 0; i < TextSize; i += 2) {
    output += String.fromCharCode(alterText[i] - varCost[i])
  }
  return output
}

export default {
  Encrypt,
  UnEncrypt,
}
