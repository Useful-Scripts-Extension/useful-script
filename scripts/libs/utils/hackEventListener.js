/**
 * Event listening hack
 * @param config.debug {Boolean} -optional Turn on debugging mode. In debugging mode, all registered events will be mounted to the window._listenerList_ object for debugging analysis.
 * @param config.proxyNodeType {String|Array} - optional proxy processing for certain types of DOM tag events
 * Please do not use event proxies for some very common tags. Too many proxies will cause serious performance consumption.
 */
export function hackEventListener(config) {
  config = config || {
    debug: false,
    proxyAll: false,
    proxyNodeType: [],
  };

  /* Preprocess the proxyNodeType data and change the characters inside to uppercase */
  let proxyNodeType = Array.isArray(config.proxyNodeType)
    ? config.proxyNodeType
    : [config.proxyNodeType];
  const tmpArr = [];
  proxyNodeType.forEach((type) => {
    if (typeof type === "string") {
      tmpArr.push(type.toUpperCase());
    }
  });
  proxyNodeType = tmpArr;

  const EVENT = window.EventTarget.prototype;
  if (EVENT._addEventListener) return;
  EVENT._addEventListener = EVENT.addEventListener;
  EVENT._removeEventListener = EVENT.removeEventListener;
  // Mounted globally for debugging
  window._listenerList_ = window._listenerList_ || {};

  // hack addEventListener
  EVENT.addEventListener = function () {
    const t = this;
    const arg = arguments;
    const type = arg[0];
    const listener = arg[1];

    if (!listener) {
      return false;
    }

    /* If you kill the sourceopen event, many website videos will not be played. */
    // if (/sourceopen/gi.test(type)) {
    //   console.log('------------------------------')
    //   console.log(type, listener)
    //   return false
    // }

    /**
     * After using Symbol, some pages will conflict with raven-js, so try catch must be performed
     * TODO How to solve this problem needs to be studied, test page: https://xueqiu.com/S/SZ300498
     */
    try {
      /**
       * Proxy the listening function
       * In order to reduce the impact on performance, only events of specific tags are proxied here.
       */
      const listenerSymbol = Symbol.for(listener);
      let listenerProxy = null;
      if (config.proxyAll || proxyNodeType.includes(t.nodeName)) {
        try {
          listenerProxy = new Proxy(listener, {
            apply(target, ctx, args) {
              // const event = args[0]
              // console.log(event.type, event, target)

              /* Let the outside control the execution of events through _listenerProxyApplyHandler_行 */
              if (t._listenerProxyApplyHandler_ instanceof Function) {
                const handlerResult = t._listenerProxyApplyHandler_(
                  target,
                  ctx,
                  args,
                  arg
                );
                if (handlerResult !== undefined) {
                  return handlerResult;
                }
              }

              return target.apply(ctx, args);
            },
          });

          /* Mount listenerProxy to itself for quick search */
          listener[listenerSymbol] = listenerProxy;

          /* Use listenerProxy to replace the listener that should be listening */
          arg[1] = listenerProxy;
        } catch (e) {
          // console.error('listenerProxy error:', e)
        }
      }
      t._addEventListener.apply(t, arg);
      t._listeners = t._listeners || {};
      t._listeners[type] = t._listeners[type] || [];
      const listenerObj = {
        target: t,
        type,
        listener,
        listenerProxy,
        options: arg[2],
        addTime: new Date().getTime(),
      };
      t._listeners[type].push(listenerObj);

      /* Mounted to global objects for observation and debugging */
      if (config.debug) {
        window._listenerList_[type] = window._listenerList_[type] || [];
        window._listenerList_[type].push(listenerObj);
      }
    } catch (e) {
      t._addEventListener.apply(t, arg);
      // console.error(e)
    }
  };

  // hack removeEventListener
  EVENT.removeEventListener = function () {
    const arg = arguments;
    const type = arg[0];
    const listener = arg[1];

    if (!listener) {
      return false;
    }

    try {
      /* Reassign arg[1] to correctly unload the corresponding listening function */
      const listenerSymbol = Symbol.for(listener);
      arg[1] = listener[listenerSymbol] || listener;

      this._removeEventListener.apply(this, arg);
      this._listeners = this._listeners || {};
      this._listeners[type] = this._listeners[type] || [];

      const result = [];
      this._listeners[type].forEach((listenerObj) => {
        if (listenerObj.listener !== listener) {
          result.push(listenerObj);
        }
      });
      this._listeners[type] = result;

      /* Remove from global list */
      if (config.debug) {
        const result = [];
        const listenerTypeList = window._listenerList_[type] || [];
        listenerTypeList.forEach((listenerObj) => {
          if (listenerObj.listener !== listener) {
            result.push(listenerObj);
          }
        });
        window._listenerList_[type] = result;
      }
    } catch (e) {
      this._removeEventListener.apply(this, arg);
      console.error(e);
    }
  };

  /* Hack the event listening method under document */
  try {
    if (document.addEventListener !== EVENT.addEventListener) {
      document.addEventListener = EVENT.addEventListener;
    }
    if (document.removeEventListener !== EVENT.removeEventListener) {
      document.removeEventListener = EVENT.removeEventListener;
    }

    // if (window.addEventListener !== EVENT.addEventListener) {
    //   window.addEventListener = EVENT.addEventListener
    // }
    // if (window.removeEventListener !== EVENT.removeEventListener) {
    //   window.removeEventListener = EVENT.removeEventListener
    // }
  } catch (e) {
    console.error(e);
  }
}
