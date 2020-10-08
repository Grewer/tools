const webCopy = (copyValue): boolean => {
  const input = document.createElement('input')
  document.body.appendChild(input)
  input.setAttribute('value', copyValue)
  input.select()
  if (document.execCommand('copy')) {
    document.execCommand('copy')
    document.body.removeChild(input)
    return true
  }
  document.body.removeChild(input)
  return false
}

export default webCopy
