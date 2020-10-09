function cleanObject(obj: object = {}) {
  Object.keys(obj).forEach(k => {
    const value = obj[k]
    if (Object.prototype.toString.call(value) === '[object Object]') {
      cleanObject(value) // 递归遍历
    }
    if (!value && value !== 0 && value !== false) {
      delete obj[k]
    }
  })
}

export default cleanObject
