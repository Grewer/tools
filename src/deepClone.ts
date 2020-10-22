const _toString = Object.prototype.toString
const reIsUint = /^(?:0|[1-9]\d*)$/

function getTag(value) {
  return _toString.call(value)
}

function isObjectLike(value) {
  return typeof value === 'object' && value !== null
}

function isArguments(value) {
  return isObjectLike(value) && getTag(value) === '[object Arguments]'
}

function isIndex(value, length) {
  const type = typeof value
  const _length = length == null ? MAX_SAFE_INTEGER : length

  return !!_length && (type === 'number' || (type !== 'symbol' && reIsUint.test(value))) && value > -1 && value % 1 === 0 && value < _length
}

function arrayLikeKeys(value) {
  const isArr = Array.isArray(value)
  const isArg = !isArr && isArguments(value)
  const isType = !isArr && !isArg && isTypedArray(value)
  const skipIndexes = isArr || isArg || isType
  const _length = value.length
  const result = new Array(skipIndexes ? _length : 0)
  let index = skipIndexes ? -1 : _length
  while (++index < _length) {
    result[index] = `${index}`
  }
  // eslint-disable-next-line no-restricted-syntax
  for (const key in value) {
    if (
      _hasOwnProperty.call(value, key) &&
      !(
        skipIndexes &&
        // Safari 9 has enumerable `arguments.length` in strict mode.
        (key === 'length' ||
          // Skip index properties.
          isIndex(key, _length))
      )
    ) {
      result.push(key)
    }
  }
  return result
}

const reTypedTag = /^\[object (?:Float(?:32|64)|(?:Int|Uint)(?:8|16|32)|Uint8Clamped)Array\]$/

const isTypedArray = value => isObjectLike(value) && reTypedTag.test(getTag(value))

const MAX_SAFE_INTEGER = 9007199254740991

function isLength(value) {
  return typeof value === 'number' && value > -1 && value % 1 === 0 && value <= MAX_SAFE_INTEGER
}

function arrayEach(array, iteratee) {
  let index = -1
  const _length = array.length

  while (++index < _length) {
    if (iteratee(array[index], index, array) === false) {
      break
    }
  }
  return array
}

function isArrayLike(value) {
  return value != null && typeof value !== 'function' && isLength(value.length)
}

function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : Object.keys(Object(object))
}

const nativeGetSymbols = Object.getOwnPropertySymbols

function getSymbols(object) {
  if (object === null) {
    return []
  }
  const _object = Object(object)
  const _propertyIsEnumerable = Object.prototype.propertyIsEnumerable
  return nativeGetSymbols(_object).filter(symbol => _propertyIsEnumerable.call(_object, symbol))
}

function getAllKeys(object) {
  const result = keys(object)
  // @ts-ignore
  result.push(...getSymbols(object))
  // object 正常键 + Symbols
  return result
}

function baseAssignValue(object, key, value) {
  if (key === '__proto__') {
    Object.defineProperty(object, key, {
      configurable: true,
      enumerable: true,
      value,
      writable: true,
    })
  } else {
    object[key] = value
  }
}

function eq(value, other) {
  // eslint-disable-next-line no-self-compare
  return value === other || (value !== value && other !== other)
}

function assignValue(object, key, value) {
  const objValue = object[key]

  if (!(_hasOwnProperty.call(object, key) && eq(objValue, value))) {
    if (value !== 0 || 1 / value === 1 / objValue) {
      baseAssignValue(object, key, value)
    }
  } else if (value === undefined && !(key in object)) {
    baseAssignValue(object, key, value)
  }
}

/** `Object#toString` result references. */
const argsTag = '[object Arguments]'
const arrayTag = '[object Array]'
const boolTag = '[object Boolean]'
const dateTag = '[object Date]'
const errorTag = '[object Error]'
const mapTag = '[object Map]'
const numberTag = '[object Number]'
const objectTag = '[object Object]'
const regexpTag = '[object RegExp]'
const setTag = '[object Set]'
const stringTag = '[object String]'
const symbolTag = '[object Symbol]'
const weakMapTag = '[object WeakMap]'

// buffer array
const arrayBufferTag = '[object ArrayBuffer]'
const dataViewTag = '[object DataView]'
const float32Tag = '[object Float32Array]'
const float64Tag = '[object Float64Array]'
const int8Tag = '[object Int8Array]'
const int16Tag = '[object Int16Array]'
const int32Tag = '[object Int32Array]'
const uint8Tag = '[object Uint8Array]'
const uint8ClampedTag = '[object Uint8ClampedArray]'
const uint16Tag = '[object Uint16Array]'
const uint32Tag = '[object Uint32Array]'

const { hasOwnProperty: _hasOwnProperty } = Object.prototype

const objectProto = Object.prototype

function isPrototype(value) {
  const Ctor = value && value.constructor
  const proto = (typeof Ctor === 'function' && Ctor.prototype) || objectProto

  return value === proto
}

function initCloneObject(object) {
  return typeof object.constructor === 'function' && !isPrototype(object) ? Object.create(Object.getPrototypeOf(object)) : {}
}

function initCloneArray(array) {
  const { length } = array
  const result = new array.constructor(length)

  // Add properties assigned by `RegExp#exec`.
  if (length && typeof array[0] === 'string' && _hasOwnProperty.call(array, 'index')) {
    result.index = array.index
    result.input = array.input
  }
  return result
}

function cloneArrayBuffer(arrayBuffer) {
  const result = new arrayBuffer.constructor(arrayBuffer.byteLength)
  new Uint8Array(result).set(new Uint8Array(arrayBuffer))
  return result
}

function cloneDataView(dataView) {
  const buffer = cloneArrayBuffer(dataView.buffer)
  return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength)
}

function cloneTypedArray(typedArray) {
  const buffer = cloneArrayBuffer(typedArray.buffer)
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length)
}

const reFlags = /\w*$/

function cloneRegExp(regexp) {
  const result = new regexp.constructor(regexp.source, reFlags.exec(regexp))
  result.lastIndex = regexp.lastIndex
  return result
}

const symbolValueOf = Symbol.prototype.valueOf

function cloneSymbol(symbol) {
  return Object(symbolValueOf.call(symbol))
}

function initCloneByTag(object, tag) {
  const Ctor = object.constructor
  switch (tag) {
    case arrayBufferTag:
      return cloneArrayBuffer(object)

    case boolTag:
    case dateTag:
      return new Ctor(+object)

    case dataViewTag:
      return cloneDataView(object)

    case float32Tag:
    case float64Tag:
    case int8Tag:
    case int16Tag:
    case int32Tag:
    case uint8Tag:
    case uint8ClampedTag:
    case uint16Tag:
    case uint32Tag:
      return cloneTypedArray(object)

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

// 判断是不是一个对象
function isObject(value) {
  const type = typeof value
  return value != null && (type === 'object' || type === 'function')
}

function deepClone(value) {
  let result
  if (!isObject(value)) {
    return value
  }

  const isArr = Array.isArray(value)

  if (isArr) {
    result = initCloneArray(value)
  }

  // 如果是对象
  // 先建立存储区域
  const isFunc = typeof value === 'function'
  const tag = getTag(value)

  if (tag === objectTag || tag === argsTag) {
    result = initCloneObject(value)
  } else if (isFunc) {
    // eslint-disable-next-line no-eval
    result = eval(`${value.toString()}`)
  } else {
    result = initCloneByTag(value, tag)
  }

  // 复制值

  // 这是 lodash 用来缓存值优化, 可以使用 Map 代替
  //  stack || (stack = new Stack)
  //   const stacked = stack.get(value)
  //   if (stacked) {
  //     return stacked
  //   }
  //   stack.set(value, result)

  // 如果是 Map 遍历每一个值 设置值
  if (tag === mapTag) {
    value.forEach((subValue, key) => {
      result.set(key, deepClone(subValue))
    })
    return result
  }

  // 如果是 Set 同理
  if (tag === setTag) {
    value.forEach(subValue => {
      result.add(deepClone(subValue))
    })
    return result
  }

  // 检查是不是 buffer 数组
  if (isTypedArray(value)) {
    return result
  }

  // 获取 value 的所有键值
  const props = isArr ? value : getAllKeys(value)

  arrayEach(props || value, (subValue, key) => {
    if (props) {
      // eslint-disable-next-line no-param-reassign
      key = subValue
      // eslint-disable-next-line no-param-reassign
      subValue = value[key]
    }
    // 设置值
    assignValue(result, key, deepClone(subValue))
  })

  return result
}

export default deepClone
