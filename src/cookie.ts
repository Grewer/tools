function setCookie(cname: string, cvalue: string, exhours: number): void {
  const d = new Date()
  d.setTime(d.getTime() + exhours * 60 * 60 * 1000)
  const expires = `expires=${d.toUTCString()}`
  document.cookie = `${cname}=${encodeURI(cvalue)}; ${expires}`
}

function getCookie(name: string): string | null {
  const reg = new RegExp(`(^| )${name}=([^;]*)(;|$)`)
  const arr = document.cookie.match(reg)
  if (arr) {
    return decodeURI(arr[2])
  }
  return null
}

export default {
  setCookie,
  getCookie,
}
