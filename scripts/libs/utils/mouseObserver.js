/**
 * Mouse event observation object
 * Used to implement penetrating response to mouse events, different from pointer-events:none
 * pointer-events:none is to set the current layer to allow penetration
 * And MouseObserver is: even if you don’t know how many layers of occlusion exist on the target, you can still respond to mouse events.
 */

export class MouseObserver {
  constructor(observeOpt) {
    this.observer = new IntersectionObserver((infoList) => {
      infoList.forEach((info) => {
        info.target.IntersectionObserverEntry = info;
      });
    }, observeOpt || {});

    this.observeList = [];
  }

  _observe(target) {
    let hasObserve = false;
    for (let i = 0; i < this.observeList.length; i++) {
      const el = this.observeList[i];
      if (target === el) {
        hasObserve = true;
        break;
      }
    }

    if (!hasObserve) {
      this.observer.observe(target);
      this.observeList.push(target);
    }
  }

  _unobserve(target) {
    this.observer.unobserve(target);
    const newObserveList = [];
    this.observeList.forEach((el) => {
      if (el !== target) {
        newObserveList.push(el);
      }
    });
    this.observeList = newObserveList;
  }

  /**
   * Add event binding
   * @param target {element} - required The DOM object to which the event is to be bound
   * @param type {string} - required The event to be bound, only mouse events are supported
   * @param listener {function} - required response function when triggering conditions are met
   */
  on(target, type, listener, options) {
    const t = this;
    t._observe(target);

    if (!target.MouseObserverEvent) {
      target.MouseObserverEvent = {};
    }
    target.MouseObserverEvent[type] = true;

    if (!t._mouseObserver_) {
      t._mouseObserver_ = {};
    }

    if (!t._mouseObserver_[type]) {
      t._mouseObserver_[type] = [];

      window.addEventListener(
        type,
        (event) => {
          t.observeList.forEach((target) => {
            const isVisibility =
              target.IntersectionObserverEntry &&
              target.IntersectionObserverEntry.intersectionRatio > 0;
            const isReg = target.MouseObserverEvent[event.type] === true;
            if (isVisibility && isReg) {
              /* Determine whether the conditions for triggering the listener event are met */
              const bound = target.getBoundingClientRect();
              const offsetX = event.x - bound.x;
              const offsetY = event.y - bound.y;
              const isNeedTap =
                offsetX <= bound.width &&
                offsetX >= 0 &&
                offsetY <= bound.height &&
                offsetY >= 0;

              if (isNeedTap) {
                /* Execute listening callback */
                const listenerList = t._mouseObserver_[type];
                listenerList.forEach((listener) => {
                  if (listener instanceof Function) {
                    listener.call(
                      t,
                      event,
                      {
                        x: offsetX,
                        y: offsetY,
                      },
                      target
                    );
                  }
                });
              }
            }
          });
        },
        options
      );
    }

    /* Add the listening callback to the event queue */
    if (listener instanceof Function) {
      t._mouseObserver_[type].push(listener);
    }
  }

  /**
   * Unbind event
   * @param target {element} -required DOM object to release the event
   * @param type {string} - required The event to be released, only mouse events are supported
   * @param listener {function} - required response function when binding events
   * @returns {boolean}
   */
  off(target, type, listener) {
    const t = this;
    if (
      !target ||
      !type ||
      !listener ||
      !t._mouseObserver_ ||
      !t._mouseObserver_[type] ||
      !target.MouseObserverEvent ||
      !target.MouseObserverEvent[type]
    )
      return false;

    const newListenerList = [];
    const listenerList = t._mouseObserver_[type];
    let isMatch = false;
    listenerList.forEach((listenerItem) => {
      if (listenerItem === listener) {
        isMatch = true;
      } else {
        newListenerList.push(listenerItem);
      }
    });

    if (isMatch) {
      t._mouseObserver_[type] = newListenerList;

      /* The listener has been completely removed */
      if (newListenerList.length === 0) {
        delete target.MouseObserverEvent[type];
      }

      /* Remove the observation object when MouseObserverEvent is an empty object */
      if (JSON.stringify(target.MouseObserverEvent[type]) === "{}") {
        t._unobserve(target);
      }
    }
  }
}

// test code
// var mouseObserver = new MouseObserver()
// var target = document.querySelector('#additional-info')
// var listener = (event, offset, target) => {
//   console.log('偏移信息：', offset, event, target)
// }
// mouseObserver.on(target, 'click', listener)
// setTimeout(function () {
//   mouseObserver.off(target, 'click', listener)
// }, 1000 * 10)
