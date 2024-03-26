import { ready } from "./ready.js";

/**
 * DOM object property listener
 * @param selector {String|Element} - required. It can be a selector or an existing DOM object. If it is a selector, ready will be called to monitor.
 * @param fn {Function} - required The callback function when the attribute changes
 * @param attrFilter {String|Array} -optional specifies the attributes to be monitored. If not specified, all attribute changes will be monitored.
 * @param shadowRoot
 */
export function attrObserver(selector, fn, attrFilter, shadowRoot) {
  if (!selector || !fn) return false;
  function _attrObserver(element) {
    const MutationObserver =
      window.MutationObserver || window.WebKitMutationObserver;
    const observer = new MutationObserver(fn);
    const observeOpts = {
      attributes: true,
      attributeOldValue: true,
    };

    if (attrFilter) {
      attrFilter = Array.isArray(attrFilter) ? attrFilter : [attrFilter];
      observeOpts.attributeFilter = attrFilter;
    }

    observer.observe(element, observeOpts);
  }

  if (typeof selector === "string" || Array.isArray(selector)) {
    ready(selector, (element) => _attrObserver(element), shadowRoot);
  } else if (/Element/.test(Object.prototype.toString.call(selector))) {
    _attrObserver(selector);
  } else {
    return false;
  }
}
