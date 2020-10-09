/**
 * jsonParse
 * @param str
 * @param defaultValue
 * @returns {any}
 */

function jsonParse(str: string, defaultValue = {}): object {
  try {
    return JSON.parse(str)
  } catch (e) {
    return defaultValue
  }
}

export default jsonParse
