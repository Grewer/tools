const _toString = Object.prototype.toString

function getTag(value) {
  return _toString.call(value)
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

  if (Array.isArray(value)) {
    result = initCloneArray(value)
  }

  // 如果是对象
  // 先建立存储区域
  const isFunc = typeof value === 'function'
  const tag = getTag(value)
  if (tag === objectTag || tag === argsTag) {
    result = isFunc ? {} : initCloneObject(value)
  } else {
    result = initCloneByTag(value, tag)
  }

  // 复制值

  return result
}

export default deepClone
