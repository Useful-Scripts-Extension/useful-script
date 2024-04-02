/*!
 * @name         object.js
 * @description  Methods related to object operations
 * @version      0.0.1
 * @author       Blaze
 * @date         21/03/2019 23:10
 * @github       https://github.com/xxxily
 */

/**
 * Make a deep copy of an object
 * @source - required (Object|Array) the object or array to be copied
 */
export function clone(source) {
  var result = {};

  if (typeof source !== "object") {
    return source;
  }
  if (Object.prototype.toString.call(source) === "[object Array]") {
    result = [];
  }
  if (Object.prototype.toString.call(source) === "[object Null]") {
    result = null;
  }
  for (var key in source) {
    result[key] =
      typeof source[key] === "object" ? clone(source[key]) : source[key];
  }
  return result;
}

/* Traverse an object without including its properties on the prototype chain */
export function forIn(obj, fn) {
  fn = fn || function () {};
  for (var key in obj) {
    if (Object.hasOwnProperty.call(obj, key)) {
      fn(key, obj[key]);
    }
  }
}

/* Get the key value of the object. ES6+ applications can use Object.keys() instead */
export function getObjKeys(obj) {
  const keys = [];
  forIn(obj, function (key) {
    keys.push(key);
  });
  return keys;
}

/**
 * Deeply merge two enumerable objects
 * @param objA {object} -required object A
 * @param objB {object} -required object B
 * @param concatArr {boolean} - Optional merging arrays. By default, when an array is encountered, the current array is directly replaced with another array. If this is set to true, when an array is encountered, it will be merged instead of directly replaced.
 * @returns {*|void}
 */
export function mergeObj(objA, objB, concatArr) {
  function isObj(obj) {
    return Object.prototype.toString.call(obj) === "[object Object]";
  }
  function isArr(arr) {
    return Object.prototype.toString.call(arr) === "[object Array]";
  }
  if (!isObj(objA) || !isObj(objB)) return objA;
  function deepMerge(objA, objB) {
    forIn(objB, function (key) {
      const subItemA = objA[key];
      const subItemB = objB[key];
      if (typeof subItemA === "undefined") {
        objA[key] = subItemB;
      } else {
        if (isObj(subItemA) && isObj(subItemB)) {
          /* 进行深层合并 */
          objA[key] = deepMerge(subItemA, subItemB);
        } else {
          if (concatArr && isArr(subItemA) && isArr(subItemB)) {
            objA[key] = subItemA.concat(subItemB);
          } else {
            objA[key] = subItemB;
          }
        }
      }
    });
    return objA;
  }
  return deepMerge(objA, objB);
}

/**
 * Deep merge of multiple objects, the merge rules are based on mergeObj, but the concatArr option does not exist
 * @returns {*}
 */
export function merge() {
  let result = arguments[0];
  for (var i = 0; i < arguments.length; i++) {
    if (i) {
      result = mergeObj(result, arguments[i]);
    }
  }
  return result;
}

/**
 * Get the value in the object based on the text path. If you need to support arrays, please use the get method of lodash
 * @param obj {Object} - required The object to be operated on
 * @param path {String} - required path information
 * @returns {*}
 */
export function getValByPath(obj, path) {
  path = path || "";
  const pathArr = path.split(".");
  let result = obj;

  /* Recursively extract the result value */
  for (let i = 0; i < pathArr.length; i++) {
    if (!result) break;
    result = result[pathArr[i]];
  }

  return result;
}

/**
 * Set the value in the object based on the text path. If you need to support arrays, please use the set method of lodash.
 * @param obj {Object} - required The object to be operated on
 * @param path {String} - required path information
 * @param val {Any} - required If this parameter is not passed, the final result will be set to undefined
 * @returns {Boolean} Returns true to indicate successful setting, otherwise setting fails
 */
export function setValByPath(obj, path, val) {
  if (!obj || !path || typeof path !== "string") {
    return false;
  }

  let result = obj;
  const pathArr = path.split(".");

  for (let i = 0; i < pathArr.length; i++) {
    if (!result) break;

    if (i === pathArr.length - 1) {
      result[pathArr[i]] = val;
      return Number.isNaN(val)
        ? Number.isNaN(result[pathArr[i]])
        : result[pathArr[i]] === val;
    }

    result = result[pathArr[i]];
  }

  return false;
}
