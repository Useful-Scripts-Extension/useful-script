/**
 *Element listener
 * @param selector - required
 * @param fn - required, callback when the element exists
 * @param shadowRoot - optional specifies to monitor the DOM element under a certain shadowRoot
 * Reference: https://javascript.ruanyifeng.com/dom/mutationobserver.html
 */
export function ready(selector, fn, shadowRoot) {
  const win = window;
  const docRoot = shadowRoot || win.document.documentElement;
  if (!docRoot) return false;
  const MutationObserver = win.MutationObserver || win.WebKitMutationObserver;
  const listeners = docRoot._MutationListeners || [];

  function $ready(selector, fn) {
    // Store selectors and callback functions
    listeners.push({
      selector: selector,
      fn: fn,
    });

    /* Add listening objects */
    if (!docRoot._MutationListeners || !docRoot._MutationObserver) {
      docRoot._MutationListeners = listeners;
      docRoot._MutationObserver = new MutationObserver(() => {
        for (let i = 0; i < docRoot._MutationListeners.length; i++) {
          const item = docRoot._MutationListeners[i];
          check(item.selector, item.fn);
        }
      });

      docRoot._MutationObserver.observe(docRoot, {
        childList: true,
        subtree: true,
      });
    }

    // Check if the node is already in the DOM
    check(selector, fn);
  }

  function check(selector, fn) {
    const elements = docRoot.querySelectorAll(selector);
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      element._MutationReadyList_ = element._MutationReadyList_ || [];
      if (!element._MutationReadyList_.includes(fn)) {
        element._MutationReadyList_.push(fn);
        fn.call(element, element);
      }
    }
  }

  const selectorArr = Array.isArray(selector) ? selector : [selector];
  selectorArr.forEach((selector) => $ready(selector, fn));
}
