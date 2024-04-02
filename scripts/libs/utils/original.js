/*!
 * @name         original.js
 * @description  Store some important native functions to prevent external contamination. This logic should be brought forward as much as possible, otherwise the contaminated functions will be stored.
 * @version      0.0.1
 * @author       xxxily
 * @date         2022/10/16 10:32
 * @github       https://github.com/xxxily
 */

export const original = {
  // Prevent defineProperty and defineProperties from being overridden by AOP scripts
  Object: {
    defineProperty: Object.defineProperty,
    defineProperties: Object.defineProperties,
  },

  // Prevent this kind of gameplay：https://juejin.cn/post/6865910564817010702
  Proxy,

  Map,
  map: {
    clear: Map.prototype.clear,
    set: Map.prototype.set,
    has: Map.prototype.has,
    get: Map.prototype.get,
    delete: Map.prototype.delete,
  },

  console: {
    log: console.log,
    info: console.info,
    error: console.error,
    warn: console.warn,
    table: console.table,
  },

  ShadowRoot,
  HTMLMediaElement,
  CustomEvent,
  // appendChild: Node.prototype.appendChild,

  JSON: {
    parse: JSON.parse,
    stringify: JSON.stringify,
  },

  alert,
  confirm,
  prompt,
};
