/*!
 * @name         url.js
 * @description  Related methods for parsing urls
 * @version      0.0.1
 * @author       Blaze
 * @date         27/03/2019 15:52
 * @github       https://github.com/xxxily
 */

/**
 * Reference example:
 * https://segmentfault.com/a/1190000006215495
 * Note: This method must rely on the browser's DOM object
 */

export function parseURL(url) {
  var a = document.createElement("a");
  a.href = url || window.location.href;
  return {
    source: url,
    protocol: a.protocol.replace(":", ""),
    host: a.hostname,
    port: a.port,
    origin: a.origin,
    search: a.search,
    query: a.search,
    file: (a.pathname.match(/\/([^/?#]+)$/i) || ["", ""])[1],
    hash: a.hash.replace("#", ""),
    path: a.pathname.replace(/^([^/])/, "/$1"),
    relative: (a.href.match(/tps?:\/\/[^/]+(.+)/) || ["", ""])[1],
    params: (function () {
      var ret = {};
      var seg = [];
      var paramArr = a.search.replace(/^\?/, "").split("&");

      for (var i = 0; i < paramArr.length; i++) {
        var item = paramArr[i];
        if (item !== "" && item.indexOf("=")) {
          seg.push(item);
        }
      }

      for (var j = 0; j < seg.length; j++) {
        var param = seg[j];
        var idx = param.indexOf("=");
        var key = param.substring(0, idx);
        var val = param.substring(idx + 1);
        if (!key) {
          ret[val] = null;
        } else {
          ret[key] = val;
        }
      }
      return ret;
    })(),
  };
}

/**
 * Convert params object into string pattern
 * @param params {Object} - required params object
 * @returns {string}
 */
export function stringifyParams(params) {
  var strArr = [];

  if (!Object.prototype.toString.call(params) === "[object Object]") {
    return "";
  }

  for (var key in params) {
    if (Object.hasOwnProperty.call(params, key)) {
      var val = params[key];
      var valType = Object.prototype.toString.call(val);

      if (val === "" || valType === "[object Undefined]") continue;

      if (val === null) {
        strArr.push(key);
      } else if (valType === "[object Array]") {
        strArr.push(key + "=" + val.join(","));
      } else {
        val = (JSON.stringify(val) || "" + val).replace(/(^"|"$)/g, "");
        strArr.push(key + "=" + val);
      }
    }
  }
  return strArr.join("&");
}

/**
 * Restore the url object parsed by parseURL into the url address
 * Mainly used to reorganize the url link after the query parameters are dynamically modified.
 * @param obj {Object} - required parseURL parses the url object
 */
export function stringifyToUrl(urlObj) {
  var query = stringifyParams(urlObj.params) || "";
  if (query) {
    query = "?" + query;
  }
  var hash = urlObj.hash ? "#" + urlObj.hash : "";
  return urlObj.origin + urlObj.path + query + hash;
}
