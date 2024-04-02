/*!
 * @name fetch-proxy.js
 * @description fetch request hook, the usage remains consistent with xhr-proxy of https://github.com/wendux/Ajax-hook to support the monitoring and modification of fetch requests
 * @version 0.0.1
 * @author xxxily
 * @date 2022/05/20 16:18
 * @github https://github.com/xxxily
 */

/**
 * Although the usage of this library remains consistent with Ajax-hook, because fetch ultimately consumes the request results differently from XMLHttpRequest,
 * Therefore, distinction must be made when performing hook operations
 *
 * Please refer to:
 * https://www.ruanyifeng.com/blog/2020/12/fetch-tutorial.html
 *
 * In order to distinguish and judge, the third parameter in onRequest, onResponse, onError will identify whether it is a fetch request. If it is true, it means it is a fetch request.
 * Then differentiate the fetch objects as needed
 */

const realFetch = "_rFetch_";

function makeHandler(resolve, reject, next) {
  return Object.create({
    resolve,
    reject,
    next,
  });
}

export function fetchProxy(proxy = {}, win) {
  win = win || window;
  win[realFetch] = win[realFetch] || win.fetch;

  const { onRequest, onResponse, onError } = proxy;

  function customFetch() {
    /**
     * Lock fetch in advance to prevent onRequest from performing asynchronous operations.
     * UnFetchHook was triggered externally, and when I went to win[realFetch], no such fetch was found.
     */
    const fetch = win[realFetch] || win.fetch;

    const t = this;
    let fetchResolve = function () {};
    let fetchReject = function () {};
    const args = arguments;
    const config = args[1] || {};

    /* Keep the config parameter structure consistent with Ajax-hook */
    config.url = args[0];
    config.headers = config.headers || {};
    if (!config.method) {
      config.method = "GET";
    } else {
      config.method = config.method.toUpperCase();
    }

    /* Make a real request */
    async function gotoFetch(config) {
      const url = config.url;
      // delete config.url
      const args = [url, config];

      if (fetch === customFetch) {
        throw new Error("[fetch loop] fetch is equal to customFetch");
      }

      const response = await fetch.apply(t, args).catch((err) => {
        if (onError instanceof Function) {
          const errorHandler = makeHandler(
            fetchResolve,
            fetchReject,
            function (err) {
              fetchReject(err);
            }
          );
          onError(err, errorHandler, true);
        } else {
          throw err;
        }
      });

      if (onResponse instanceof Function) {
        const responseHandler = makeHandler(
          fetchResolve,
          fetchReject,
          function (response) {
            fetchResolve(response);
          }
        );

        response.config = config;
        onResponse(response, responseHandler, true);
      } else {
        /* Complete request */
        fetchResolve(response);
      }
    }

    /* Determine who initiated the real request */
    if (onRequest instanceof Function) {
      const requestHandler = makeHandler(
        fetchResolve,
        fetchReject,
        function (config) {
          gotoFetch(config);
        }
      );
      onRequest(config, requestHandler, true);
    } else {
      gotoFetch(config);
    }

    /* Return an empty promise, let gotoFetch handle the actual request, and control the promise */
    return new Promise((resolve, reject) => {
      fetchResolve = function (result) {
        resolve(result);
      };
      fetchReject = function (err) {
        reject(err);
      };
    });
  }

  win.fetch = customFetch;
}

export function unFetchProxy(win) {
  win = win || window;
  if (win[realFetch]) {
    win.fetch = win[realFetch];
    delete win[realFetch];
  }
}

/* Usage example */
// fetchProxy({
//   onRequest: async (config, handler, isFetch) => {
//     console.log('[fetchHooks onRequest]', config.url, config)
//     handler.next(config)
//   },
//   onError: (err, handler, isFetch) => {
//     handler.next(err)
//   },
//   onResponse: async (response, handler, isFetch) => {
//     console.log('[fetchHooks onResponse]', response)

//     /* 当和Ajax-hook混合使用时，需要判断isFetch，进行区分处理 */
//     if (isFetch) {
//       const res = response.clone()
//       const result = await res.json().catch((err) => {
//         // 解析出错，忽略报错
//         if (err) {}
//       })
//       console.log('[fetchHooks onResponse json]', result)
//     }

//     handler.next(response)
//   }
// }, window)
