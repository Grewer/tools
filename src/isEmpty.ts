/**
 * isEmpty 函数  功能与 lodash 的类似,更加小巧  能区别大部分情况
 */

const MAX_SAFE_INTEGER = 9007199254740991

function isLength(value) {
  return typeof value === 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER
}

function isArrayLike(value) {
  return value != null && typeof value !== 'function' && isLength(value.length)
}

const _toString = Object.prototype.toString

function getTag(value) {
  return _toString.call(value)
}

const _hasOwnProperty = Object.prototype.hasOwnProperty

function isEmpty(value) {
  // 检测 null
  if (value == null) {
    return true
  }

  // 类数组  字符串
  if (isArrayLike(value)) {
    return !Object.keys(value).length
  }

  const tag = getTag(value)

  // Set Map
  if (tag === '[object Map]' || tag === '[object Set]') {
    return !value.size
  }

  // 对象
  // eslint-disable-next-line no-restricted-syntax
  for (const key in value) {
    if (_hasOwnProperty.call(value, key)) {
      return false
    }
  }

  // Boolean Number function
  return true
}

export default isEmpty
