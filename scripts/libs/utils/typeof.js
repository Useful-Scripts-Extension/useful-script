/*!
 * @name         utils.js
 * @description  Data type related methods
 * @version      0.0.1
 * @author       Blaze
 * @date         22/03/2019 22:46
 * @github       https://github.com/xxxily
 */

/**
 * Accurately obtain the specific type of object. See: https://www.talkingcoder.com/article/6333557442705696719
 * @param obj { all } -Required The object to be judged
 * @returns {*} Returns the specific type of judgment
 */
export function getType(obj) {
  if (obj == null) {
    return String(obj);
  }
  return typeof obj === "object" || typeof obj === "function"
    ? (obj.constructor &&
        obj.constructor.name &&
        obj.constructor.name.toLowerCase()) ||
        /function\s(.+?)\(/.exec(obj.constructor)[1].toLowerCase()
    : typeof obj;
}

export const isType = (obj, typeName) => getType(obj) === typeName;
export const isObj = (obj) => isType(obj, "object");
export const isErr = (obj) => isType(obj, "error");
export const isArr = (obj) => isType(obj, "array");
export const isRegExp = (obj) => isType(obj, "regexp");
export const isFunction = (obj) => obj instanceof Function;
export const isUndefined = (obj) => isType(obj, "undefined");
export const isNull = (obj) => isType(obj, "null");
