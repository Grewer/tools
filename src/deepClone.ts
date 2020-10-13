// baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG)
// const CLONE_DEEP_FLAG = 1
// const CLONE_SYMBOLS_FLAG = 4
//

/**
 * 获取 tag
 */
const _toString = Object.prototype.toString

function getTag(value) {
  return _toString.call(value)
}

const { hasOwnProperty: _hasOwnProperty } = Object.prototype

function initCloneByTag(object, tag, isDeep) {
  const Ctor = object.constructor
  switch (tag) {
    case arrayBufferTag:
      return cloneArrayBuffer(object)

    case boolTag:
    case dateTag:
      return new Ctor(+object)

    case dataViewTag:
      return cloneDataView(object, isDeep)

    case float32Tag:
    case float64Tag:
    case int8Tag:
    case int16Tag:
    case int32Tag:
    case uint8Tag:
    case uint8ClampedTag:
    case uint16Tag:
    case uint32Tag:
      return cloneTypedArray(object, isDeep)

    case mapTag:
      return new Ctor()

    case numberTag:
    case stringTag:
      return new Ctor(object)

    case regexpTag:
      return cloneRegExp(object)

    case setTag:
      return new Ctor()

    case symbolTag:
      return cloneSymbol(object)
  }
}

function initCloneArray(array) {
  // 初始化一个新的数组, 与原数组不同
  const { length } = array
  const result = new array.constructor(length)

  // Add properties assigned by `RegExp#exec`.
  // 如果是正则 exec 的执行结果  ,如: /\d/.exec('asdsad1231')
  // array.index 有这个值
  if (length && typeof array[0] === 'string' && _hasOwnProperty.call(array, 'index')) {
    result.index = array.index
    result.input = array.input
  }
  // 返回一个新数组  内存与原数组不同
  return result
}

function deepClone(value, bitmask, customizer, key, object, stack) {
  let result

  const isDeep = true // 深拷贝
  const isFlat = true // 展开继承的属性
  const isFull = true // 是否拷贝 symbol

  // 如果不是 object 直接返回值
  // 如果 value 类型为 object 或 function 则通过
  const type = typeof value
  if (!(value !== null && (type === 'object' || type === 'function'))) {
    return value
  }

  // 判断是否是数组  获取 tag
  const isArr = Array.isArray(value)
  const tag = getTag(value)

  // 到这一步 可以确定的几种  数组  对象(包括正常对象和 Date, 正则, Map, Set ,arrayBuffer 类)  函数
  // 如果是数组 则初始化出一个新数组
  if (isArr) {
    result = initCloneArray(value)
  } else {
    const isFunc = typeof value === 'function'

    // buffer 类, 前端没有 buffer , node 环境有, 暂时可以忽略

    if (tag === objectTag || tag === argsTag || (isFunc && !object)) {
      result = isFlat || isFunc ? {} : initCloneObject(value)
      if (!isDeep) {
        return isFlat ? copySymbolsIn(value, copyObject(value, keysIn(value), result)) : copySymbols(value, Object.assign(result, value))
      }
    } else {
      if (isFunc || !cloneableTags[tag]) {
        return object ? value : {}
      }
      result = initCloneByTag(value, tag, isDeep)
    }
  }

  // Check for circular references and return its corresponding clone.
  stack || (stack = new Stack())
  const stacked = stack.get(value)
  if (stacked) {
    return stacked
  }
  stack.set(value, result)

  if (tag == mapTag) {
    value.forEach((subValue, key) => {
      result.set(key, baseClone(subValue, bitmask, customizer, key, value, stack))
    })
    return result
  }

  if (tag == setTag) {
    value.forEach(subValue => {
      result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack))
    })
    return result
  }

  if (isTypedArray(value)) {
    return result
  }

  const keysFunc = isFull ? (isFlat ? getAllKeysIn : getAllKeys) : isFlat ? keysIn : keys

  const props = isArr ? undefined : keysFunc(value)
  arrayEach(props || value, (subValue, key) => {
    if (props) {
      key = subValue
      subValue = value[key]
    }
    // Recursively populate clone (susceptible to call stack limits).
    assignValue(result, key, baseClone(subValue, bitmask, customizer, key, value, stack))
  })
  return result
}

export default deepClone
