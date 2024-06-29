export const cancelKey = "_ufs_cancel_";

function _hook(configs = []) {
  const unsubFn = [];
  for (let { fn, arr } of configs) {
    let id = randId();
    arr.push({ fn, id });
    unsubFn.push(() => {
      let index = arr.findIndex((e) => e.id === id);
      if (index !== -1) arr.splice(index, 1);
    });
  }

  return () => {
    unsubFn.forEach((fn) => fn?.());
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
      request = fn?.(request.url, request.options) || request;
    if (request?.options?.[cancelKey]) return null;

    let response = await originalFetch(...request);
    for (let { fn } of onAfterFetchFn)
      response = fn?.(request.url, request.options, response) || response;

    return response;
  };
}

export function hookFetch({ onBefore, onAfter } = {}) {
  if (!readyFetch) {
    initFetch();
    readyFetch = true;
  }
  return _hook([
    { fn: onBefore, arr: onBeforeFetchFn },
    { fn: onAfter, arr: onAfterFetchFn },
  ]);
}

/* hookFetch example
hookFetch({
  onBefore: (url, options) => {
    console.log(url, options);
    return CANCEL_FETCH;
  },
  onAfter: (url, options, response) => {
    console.log(url, options, response);
    reponse = null; // modify response
    return response;
  },
});
*/

// =========== XHR ============
const onBeforeOpenXHRFn = [];
const onBeforeSendXHRFn = [];
const onAfterSendXHRFn = [];
let readyXhr = false;

export const CANCEL_XHR = {
  [cancelKey]: true,
};

function initXhr() {
  const orig = window.XMLHttpRequest;
  window.XMLHttpRequest = new Proxy(orig, {
    construct(o, r) {
      const instance = new o(...r);

      let p;

      const open = instance.open;
      instance.open = function (method, url, async, user, password) {
        this._method = method;
        this._url = url;

        p = { method, url, async, user, password };
        for (let { fn } of onBeforeOpenXHRFn) p = fn?.(p) || p;
        if (p?.[cancelKey]) return;

        return open.apply(this, [p.mr]);
      };

      const send = instance.send;
      instance.send = function (data) {
        for (let { fn } of onBeforeSendXHRFn) data = fn?.(p, data) || data;
        if (data?.[cancelKey]) return;

        instance.addEventListener("load", function () {
          for (let { fn } of onAfterSendXHRFn)
            fn?.(p, data, instance.responseText);
        });

        return send.apply(this, arguments);
      };
      return instance;
    },
  });
}

export function hookXHR({ onBeforeOpen, onBeforeSend, onAfterSend } = {}) {
  if (!readyXhr) {
    initXhr();
    readyXhr = true;
  }
  return _hook([
    { fn: onBeforeOpen, arr: onBeforeOpenXHRFn },
    { fn: onBeforeSend, arr: onBeforeSendXHRFn },
    { fn: onAfterSend, arr: onAfterSendXHRFn },
  ]);
}

/* hookXHR example
hookXHR({
  onBeforeOpen: ({method, url, async, user, password}) => {
    // return CANCEL_XHR;
  },
  onBeforeSend: ({method, url, async, user, password}, dataSend) => {
    // return CANCEL_XHR;
  },
  onAfterSend: ({method, url, async, user, password}, dataSend, response) => {}
});
*/
