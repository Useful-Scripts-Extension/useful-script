export const cancelKey = "_ufs_cancel_";

function hook({ onBefore, onAfter, onBeforeArr, onAfterArr } = {}) {
  const beforeId = randId();
  const afterId = randId();

  if (typeof onBefore === "function")
    onBeforeArr.push({ fn: onBefore, id: beforeId });
  if (typeof onAfter === "function")
    onAfterArr.push({ fn: onAfter, id: afterId });

  return () => {
    let beforeIndex = onBeforeArr.findIndex((e) => e.id === beforeId);
    let afterIndex = onAfterArr.findIndex((e) => e.id === afterId);

    if (beforeIndex !== -1) onBeforeArr.splice(beforeIndex, 1);
    if (afterIndex !== -1) onAfterArr.splice(afterIndex, 1);
  };
}

function randId() {
  return Math.random().toString(36).slice(2);
}

// ============ FETCH ============
const onBeforeFetchFn = [];
const onAfterFetchFn = [];
let readyFetch = false;
export const CANCEL_FETCH = {
  options: { [cancelKey]: true },
};

function initFetch() {
  const originalFetch = window.fetch;
  window.fetch = async function (url, options) {
    let request = { url, options };
    for (let { fn } of onBeforeFetchFn)
      request = fn(request.url, request.options) || request;
    if (request?.options?.[cancelKey]) return null;

    let response = await originalFetch(...request);
    for (let { fn } of onAfterFetchFn)
      response = fn(request.url, request.options, response) || response;

    return response;
  };
}

export function hookFetch({ onBefore, onAfter } = {}) {
  if (!readyFetch) {
    initFetch();
    readyFetch = true;
  }
  return hook({
    onBefore,
    onAfter,
    onBeforeArr: onBeforeFetchFn,
    onAfterArr: onAfterFetchFn,
  });
}

/* hookFetch example
hookFetch({
  onBefore: (url, options) => {
    console.log(url, options);
    return CANCEL_FETCH;
  },
  onAfter: (url, options, response) => {
    console.log(url, options, response);
    return res;
  },
});
*/

// =========== XHR ============
const onBeforeXHRFn = [];
const onAfterXHRFn = [];
let readyXhr = false;

export const CANCEL_XHR = {
  [cancelKey]: true,
};

function initXhr() {
  const originalXMLHttpRequest = window.XMLHttpRequest;
  window.XMLHttpRequest = new Proxy(originalXMLHttpRequest, {
    construct(target, args) {
      const instance = new target(...args);

      const open = instance.open;
      instance.open = function (method, url, m, y, f) {
        this._method = method;
        this._url = url;
        return open.apply(this, arguments);
      };

      const send = instance.send;
      instance.send = function (dataSend) {
        this.dataSend = dataSend;

        for (let { fn } of onBeforeXHRFn)
          dataSend = fn(this._url, this._method, dataSend) || dataSend;

        if (dataSend?.[cancelKey]) return null;

        return send.apply(this, arguments);
      };

      // TODO verify
      instance.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
          for (let { fn } of onAfterXHRFn)
            fn(this._url, this._method, this.dataSend, this.responseText);
        }
      };

      return instance;
    },
  });
}

export function hookXHR({ onBefore, onAfter } = {}) {
  if (!readyXhr) {
    initXhr();
    readyFetch = true;
  }
  return hook({
    onBefore,
    onAfter,
    onBeforeArr: onBeforeXHRFn,
    onAfterArr: onAfterXHRFn,
  });
}

/* hookXHR example
hookXHR({
  onBefore: (url, method, dataSend) => {
    console.log({ url, method, dataSend });
    return dataSend;
    // return CANCEL_XHR;
  },
  onAfter: (url, method, dataSend, response) => {
    console.log({ url, method, dataSend, response });
    return res;
  },
});
*/
