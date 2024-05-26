export default {
  icon: '<i class="fa-solid fa-computer-mouse fa-lg"></i>',
  name: {
    en: "Super smooth scroll",
    vi: "Cuộn chuột siêu mượt",
  },
  description: {
    en: `Scroll smoothly on all websites with your mouse and keyboard.<br/>
    Smooth like when you scroll this extension.<br/>`,
    vi: `Cuộn chuột siêu mượt cho mọi trang web.<br/>
    Mượt như khi cuộn chuột trong extension này vậy.<br/>`,
    video: "https://www.smoothscroll.net/mac/img/vid/Demo-Mac-720p.mp4",
  },

  buttons: [
    {
      icon: '<i class="fa-solid fa-display"></i>',
      name: {
        vi: "Phần mềm cho windows/mac",
        en: "App for windows/mac",
      },
      onClick: () => window.open("https://www.smoothscroll.net/", "_blank"),
    },
  ],

  changeLogs: {
    "2024-05-26": "init",
  },

  popupScript: {
    onEnable: async () => {
      const { t } = await import("../popup/helpers/lang.js");
      const { runScriptInTab } = await import("./helpers/utils.js");
      chrome.tabs.query({}, async (tabs) => {
        let count = 0;
        for (let tab of tabs) {
          try {
            await runScriptInTab({
              target: {
                tabId: tab.id,
                allFrames: true,
              },
              func: run,
              world: "ISOLATED",
            });
            count++;
          } catch (e) {
            console.error(e);
          }
        }
        if (count)
          Swal.fire({
            icon: "success",
            title: t({
              vi: "Đã bật Cuộn chuột Siêu mượt",
              en: "Super smooth scroll enabled",
            }),
            html: t({
              vi:
                `Đã tự BẬT cho ${count} tab đang mở<br/><br/>` +
                "Bạn có thể dùng ngay không cần tải lại trang.",
              en:
                `Enabled smooth scroll for ${count} opening tabs<br/><br/>` +
                "Dont need to reload websites.",
            }),
          });
      });
    },
    onDisable: async () => {
      const { t } = await import("../popup/helpers/lang.js");
      const { runScriptInTab } = await import("./helpers/utils.js");
      chrome.tabs.query({}, async (tabs) => {
        let count = 0;
        for (let tab of tabs) {
          try {
            await runScriptInTab({
              target: {
                tabId: tab.id,
                allFrames: true,
              },
              func: () => {
                window.ufs_smoothScroll_disable?.();
              },
              world: "ISOLATED",
            });
            count++;
          } catch (e) {
            console.error(e);
          }
        }
        Swal.fire({
          icon: "success",
          title: t({
            vi: "Đã tắt Cuộn chuột Siêu mượt",
            en: "Super smooth scroll disabled",
          }),
          html: t({
            vi:
              `Đã tự TẮT cho ${count} tab đang mở<br/><br/>` +
              "Không cần tải lại trang.",
            en:
              `Disabled smooth scroll for ${count} opening tabs<br/><br/>` +
              "Dont need to reload websites.",
          }),
        });
      });
    },
  },

  contentScript: {
    onDocumentStart_: (details) => {
      run();
    },
  },
};

// TODO: setting page + horizontal scroll + fix window.scrollTo with behavior: "smooth"

// https://chromewebstore.google.com/detail/smoothscroll/nbokbjkabcmbfdlbddjidfmibcpneigj
export function run() {
  // =======================================================================
  // ============================ sscr.js ==================================
  // =======================================================================

  // Scroll Variables (tweakable)
  let defaultOptions = {
    // Scrolling Core
    frameRate: 150, // [Hz]
    animationTime: 400, // [px]
    stepSize: 100, // [px]
    // Pulse (less tweakable)
    // ratio of 'tail' to 'acceleration'
    pulseAlgorithm: true,
    pulseScale: 4,
    pulseNormalize: 1,
    // Acceleration
    accelerationDelta: 50, // 20
    accelerationMax: 3, // 1
    // Keyboard Settings
    keyboardSupport: true, // option
    arrowScroll: 50, // [px]
    // Other
    touchpadSupport: true,
    fixedBackground: true,
    reverseDirection: false, // for linux users mostly
    excluded: "",
  };
  let options = defaultOptions;
  // Other Variables
  let isExcluded = false;
  let isFrame = false;
  let direction = {
    x: 0,
    y: 0,
  };
  let initDone = false;
  let root = document.documentElement;
  let activeElement;
  let observer;
  let deltaBuffer = [];
  let deltaBufferTimer;
  let isMac = /^Mac/.test(navigator.platform);
  let isWin = /Windows/i.test(navigator.userAgent);
  let isLinux = /Linux/i.test(navigator.userAgent);
  let key = {
    left: 37,
    up: 38,
    right: 39,
    down: 40,
    spacebar: 32,
    pageup: 33,
    pagedown: 34,
    end: 35,
    home: 36,
  };
  let arrowKeys = {
    37: 1,
    38: 1,
    39: 1,
    40: 1,
  };
  /***********************************************
   * SETTINGS
   ***********************************************/
  chrome.storage.sync.get(defaultOptions, function (syncedOptions) {
    options = syncedOptions;
    // it seems that sometimes settings come late
    // and we need to test again for excluded pages
    initTest();
  });
  /***********************************************
   * INITIALIZE
   ***********************************************/
  /**
   * Tests if smooth scrolling is allowed. Shuts down everything if not.
   */
  function initTest() {
    // disable keyboard support if the user said so
    if (!options.keyboardSupport) {
      removeEvent("keydown", keydown);
    }
    // disable everything if the page is blacklisted
    if (options.excluded) {
      let domains = options.excluded.split(/[,\n] ?/);
      domains.push("mail.google.com"); // exclude Gmail for now
      domains.push("play.google.com/music"); // problem with Polymer elements
      for (let i = domains.length; i--; ) {
        if (document.URL.indexOf(domains[i]) > -1) {
          isExcluded = true;
          cleanup();
          return;
        }
      }
    }
  }
  /**
   * Sets up scrolls array, determines if frames are involved.
   */
  function init() {
    if (initDone || isExcluded || !document.body) {
      return;
    }
    initDone = true;
    let body = document.body;
    let html = document.documentElement;
    let windowHeight = window.innerHeight;
    let scrollHeight = body.scrollHeight;
    // check compat mode for root element
    root = document.compatMode.indexOf("CSS") >= 0 ? html : body;
    activeElement = body;
    // Checks if this script is running in a frame
    if (top != self) {
      isFrame = true;
    }
    // TODO: check if clearfix is still needed
    else if (
      scrollHeight > windowHeight &&
      body.clientHeight + 1 < body.scrollHeight &&
      html.clientHeight + 1 < html.scrollHeight
    ) {
      if (root.offsetHeight <= windowHeight) {
        let clearfix = document.createElement("div");
        clearfix.style.clear = "both";
        body.appendChild(clearfix);
      }
    }
    // disable fixed background
    if (!options.fixedBackground && !isExcluded) {
      body.style.backgroundAttachment = "scroll";
      html.style.backgroundAttachment = "scroll";
    }
    if (!isFrame) {
      addEvent("message", function (e) {
        if (e.data.SS == "SmoothScroll") {
          let wheelEvent = e.data;
          wheelEvent.target = getFrameByEvent(e);
          wheel(wheelEvent);
        }
      });
    }
  }
  function getFrameByEvent(event) {
    let iframes = document.getElementsByTagName("iframe");
    return [].filter.call(iframes, function (iframe) {
      return iframe.contentWindow === event.source;
    })[0];
  }
  /**
   * Removes event listeners and other traces left on the page.
   */
  function cleanup() {
    observer && observer.disconnect();
    removeEvent(wheelEvent, wheel);
    removeEvent("mousedown", mousedown);
    removeEvent("keydown", keydown);
  }
  /**
   * Make sure we are the last listener on the page so special
   * key event handlers (e.g for <video>) can come before us
   */
  function loaded() {
    setTimeout(function () {
      init();
      if (options.keyboardSupport) {
        removeEvent("keydown", keydown);
        addEvent("keydown", keydown);
      }
    }, 1);
  }
  /************************************************
   * SCROLLING
   ************************************************/
  let que = [];
  let pending = null;
  let lastScroll = Date.now();
  /**
   * Pushes scroll actions to the scrolling queue.
   */
  function scrollArray(elem, left, top) {
    directionCheck(left, top);
    if (options.accelerationMax != 1) {
      let now = Date.now();
      let elapsed = now - lastScroll;
      if (elapsed < options.accelerationDelta) {
        let factor = (1 + 50 / elapsed) / 2;
        if (factor > 1) {
          factor = Math.min(factor, options.accelerationMax);
          left *= factor;
          top *= factor;
        }
      }
      lastScroll = Date.now();
    }
    // push a scroll command
    que.push({
      x: left,
      y: top,
      lastX: left < 0 ? 0.99 : -0.99,
      lastY: top < 0 ? 0.99 : -0.99,
      start: Date.now(),
    });
    // don't act if there's a pending frame loop
    if (pending) {
      return;
    }
    let scrollRoot = getScrollRoot();
    let isWindowScroll = elem === scrollRoot || elem === document.body;
    // if we haven't already fixed the behavior,
    // and it needs fixing for this sesh
    if (elem.$scrollBehavior == null && isScrollBehaviorSmooth(elem)) {
      elem.$scrollBehavior = elem.style.scrollBehavior;
      elem.style.scrollBehavior = "auto";
    }
    let step = function (time) {
      let now = Date.now();
      let scrollX = 0;
      let scrollY = 0;
      for (let i = 0; i < que.length; i++) {
        let item = que[i];
        let elapsed = now - item.start;
        let finished = elapsed >= options.animationTime;
        // scroll position: [0, 1]
        let position = finished ? 1 : elapsed / options.animationTime;
        // easing [optional]
        if (options.pulseAlgorithm) {
          position = pulse(position);
        }
        // only need the difference
        let x = (item.x * position - item.lastX) >> 0;
        let y = (item.y * position - item.lastY) >> 0;
        // add this to the total scrolling
        scrollX += x;
        scrollY += y;
        // update last values
        item.lastX += x;
        item.lastY += y;
        // delete and step back if it's over
        if (finished) {
          que.splice(i, 1);
          i--;
        }
      }
      if (window.devicePixelRatio) {
        //scrollX /= (window.devicePixelRatio;
        //scrollY /= window.devicePixelRatio;
      }
      // scroll left and top
      if (isWindowScroll) {
        window.scrollBy(scrollX, scrollY);
      } else {
        if (scrollX) elem.scrollLeft += scrollX;
        if (scrollY) elem.scrollTop += scrollY;
      }
      // clean up if there's nothing left to do
      if (!left && !top) {
        que = [];
      }
      if (que.length) {
        pending = window.requestAnimationFrame(step);
      } else {
        pending = null;
        // restore default behavior at the end of scrolling sesh
        if (elem.$scrollBehavior != null) {
          elem.style.scrollBehavior = elem.$scrollBehavior;
          elem.$scrollBehavior = null;
        }
      }
    };
    // start a new queue of actions
    pending = window.requestAnimationFrame(step);
  }
  /***********************************************
   * EVENTS
   ***********************************************/
  /**
   * Mouse wheel handler.
   * @param {Object} event
   */
  function wheel(event) {
    if (!initDone) {
      init();
    }
    let target = event.target;
    // leave early if default action is prevented
    // or it's a zooming event with CTRL
    if (event.defaultPrevented || event.ctrlKey) {
      return true;
    }
    // leave embedded content alone (flash & pdf)
    if (
      isNodeName(activeElement, "embed") ||
      (isNodeName(target, "embed") && /\.pdf/i.test(target.src)) ||
      isNodeName(activeElement, "object") ||
      target.shadowRoot
    ) {
      return true;
    }
    let deltaX = -event.wheelDeltaX || event.deltaX || 0;
    let deltaY = -event.wheelDeltaY || event.deltaY || 0;
    if (isMac) {
      if (event.wheelDeltaX && isDivisible(event.wheelDeltaX, 120)) {
        deltaX = -120 * (event.wheelDeltaX / Math.abs(event.wheelDeltaX));
      }
      if (event.wheelDeltaY && isDivisible(event.wheelDeltaY, 120)) {
        deltaY = -120 * (event.wheelDeltaY / Math.abs(event.wheelDeltaY));
      }
    }
    if (isLinux) {
      // issues #148 #176
      let otherModifier = event.ctrlKey || event.altKey || event.metaKey;
      if (event.shiftKey && !otherModifier) {
        deltaX = deltaX || deltaY;
        deltaY = 0;
      }
    }
    // use wheelDelta if deltaX/Y is not available
    if (!deltaX && !deltaY) {
      deltaY = -event.wheelDelta || 0;
    }
    // line based scrolling
    if (event.deltaMode === 1) {
      deltaX *= 40;
      deltaY *= 40;
    }
    // check if it's a touchpad scroll that should be ignored
    if (!options.touchpadSupport && isTouchpad(deltaY)) {
      return true;
    }
    let xOnly = deltaX && !deltaY;
    let overflowing = overflowingAncestor(target, xOnly);
    // nothing to do if there's no element that's scrollable
    if (!overflowing) {
      // Chrome iframes seem to eat wheel events, which we need to
      // propagate up if the iframe has nothing overflowing to scroll
      if (isFrame) {
        event.preventDefault();
        postScrollToParent(deltaX, deltaY);
        // change target to iframe element itself for the parent frame
        //Object.defineProperty(event, "target", {value: window.frameElement});
        //return parent.wheel(event);
      }
      return true;
    }
    if (options.reverseDirection) {
      deltaX *= -1;
      deltaY *= -1;
    }
    // scale by step size
    // delta is 120 most of the time
    // synaptics seems to send 1 sometimes
    if (Math.abs(deltaX) > 1.2) {
      deltaX *= options.stepSize / 120;
    }
    if (Math.abs(deltaY) > 1.2) {
      deltaY *= options.stepSize / 120;
    }
    scrollArray(overflowing, deltaX, deltaY);
    if (event.preventDefault) event.preventDefault();
    scheduleClearCache();
  }
  /**
   * Keydown event handler.
   * @param {Object} event
   */
  function keydown(event) {
    let target = event.target;
    let modifier =
      event.ctrlKey ||
      event.altKey ||
      event.metaKey ||
      (event.shiftKey && event.keyCode !== key.spacebar);
    // our own tracked active element could've been removed from the DOM
    if (!document.contains(activeElement)) {
      activeElement = document.activeElement;
    }
    // do nothing if user is editing text
    // or using a modifier key (except shift)
    // or in a dropdown
    // or inside interactive elements
    let inputNodeNames = /^(textarea|select|embed|object)$/i;
    let buttonTypes = /^(button|submit|radio|checkbox|file|color|image)$/i;
    if (
      event.defaultPrevented ||
      inputNodeNames.test(target.nodeName) ||
      (isNodeName(target, "input") && !buttonTypes.test(target.type)) ||
      isNodeName(activeElement, "video") ||
      isInsideYoutubeVideo(event) ||
      target.isContentEditable ||
      modifier
    ) {
      return true;
    }
    // [spacebar] should trigger button press, leave it alone
    if (
      (isNodeName(target, "button") ||
        (isNodeName(target, "input") && buttonTypes.test(target.type))) &&
      event.keyCode === key.spacebar
    ) {
      return true;
    }
    // [arrwow keys] on radio buttons should be left alone
    if (
      isNodeName(target, "input") &&
      target.type == "radio" &&
      arrowKeys[event.keyCode]
    ) {
      return true;
    }
    let xOnly = event.keyCode == key.left || event.keyCode == key.right;
    let overflowing = overflowingAncestor(activeElement, xOnly);
    if (!overflowing) {
      // iframes seem to eat key events, which we need to propagate up
      // if the iframe has nothing overflowing to scroll
      return isFrame ? parent.keydown(event) : true;
    }
    let clientHeight = overflowing.clientHeight;
    let shift,
      x = 0,
      y = 0;
    if (overflowing == document.body) {
      clientHeight = window.innerHeight;
    }
    switch (event.keyCode) {
      case key.up:
        y = -options.arrowScroll;
        break;
      case key.down:
        y = options.arrowScroll;
        break;
      case key.spacebar: // (+ shift)
        shift = event.shiftKey ? 1 : -1;
        y = -shift * clientHeight * 0.9;
        break;
      case key.pageup:
        y = -clientHeight * 0.9;
        break;
      case key.pagedown:
        y = clientHeight * 0.9;
        break;
      case key.home:
        if (overflowing == document.body && document.scrollingElement)
          overflowing = document.scrollingElement;
        y = -overflowing.scrollTop;
        break;
      case key.end:
        let scroll = overflowing.scrollHeight - overflowing.scrollTop;
        let scrollRemaining = scroll - clientHeight;
        y = scrollRemaining > 0 ? scrollRemaining + 10 : 0;
        break;
      case key.left:
        x = -options.arrowScroll;
        break;
      case key.right:
        x = options.arrowScroll;
        break;
      default:
        return true; // a key we don't care about
    }
    scrollArray(overflowing, x, y);
    event.preventDefault();
    scheduleClearCache();
  }
  /**
   * Mousedown event only for updating activeElement
   */
  function mousedown(event) {
    activeElement = event.target;
  }
  /***********************************************
   * OVERFLOW
   ***********************************************/
  let uniqueID = (function () {
    let i = 0;
    return function (el) {
      return el.uniqueID || (el.uniqueID = i++);
    };
  })();
  let cacheX = {}; // cleared out after a scrolling session
  let cacheY = {}; // cleared out after a scrolling session
  let clearCacheTimer;
  let smoothBehaviorForElement = {};
  //setInterval(function () { cache = {}; }, 10 * 1000);
  function scheduleClearCache() {
    clearTimeout(clearCacheTimer);
    clearCacheTimer = setInterval(function () {
      cacheX = cacheY = smoothBehaviorForElement = {};
    }, 1 * 1000);
  }
  function setCache(elems, overflowing, x) {
    let cache = x ? cacheX : cacheY;
    for (let i = elems.length; i--; ) cache[uniqueID(elems[i])] = overflowing;
    return overflowing;
  }
  function getCache(el, x) {
    return (x ? cacheX : cacheY)[uniqueID(el)];
  }
  //  (body)                (root)
  //         | hidden | visible | scroll |  auto  |
  // hidden  |   no   |    no   |   YES  |   YES  |
  // visible |   no   |   YES   |   YES  |   YES  |
  // scroll  |   no   |   YES   |   YES  |   YES  |
  // auto    |   no   |   YES   |   YES  |   YES  |
  function overflowingAncestor(el, x) {
    let elems = [];
    let body = document.body;
    let rootScrollHeight = root.scrollHeight;
    let rootScrollWidth = root.scrollWidth;
    do {
      let cached = getCache(el, x);
      if (cached) {
        return setCache(elems, cached, x);
      }
      elems.push(el);
      if (
        (x && rootScrollWidth === el.scrollWidth) ||
        (!x && rootScrollHeight === el.scrollHeight)
      ) {
        let topOverflowsNotHidden =
          overflowNotHidden(root, x) && overflowNotHidden(body, x);
        let isOverflowCSS =
          topOverflowsNotHidden || overflowAutoOrScroll(root, x);
        if (
          (isFrame && isContentOverflowing(root, x)) ||
          (!isFrame && isOverflowCSS)
        ) {
          return setCache(elems, getScrollRoot(), x);
        }
      } else if (isContentOverflowing(el, x) && overflowAutoOrScroll(el, x)) {
        return setCache(elems, el, x);
      }
    } while ((el = el.parentElement));
  }
  function isContentOverflowing(el, x) {
    return x
      ? el.clientWidth + 10 < el.scrollWidth
      : el.clientHeight + 10 < el.scrollHeight;
  }
  function computedOverflow(el, x) {
    let property = x ? "overflow-x" : "overflow-y";
    return getComputedStyle(el, "").getPropertyValue(property);
  }
  // typically for <body> and <html>
  function overflowNotHidden(el, x) {
    return computedOverflow(el, x) != "hidden";
  }
  // for all other elements
  function overflowAutoOrScroll(el, x) {
    return /^(scroll|auto)$/.test(computedOverflow(el, x));
  }
  // for all other elements
  function isScrollBehaviorSmooth(el) {
    let id = uniqueID(el);
    if (smoothBehaviorForElement[id] == null) {
      let scrollBehavior = getComputedStyle(el, "")["scroll-behavior"];
      smoothBehaviorForElement[id] = "smooth" == scrollBehavior;
    }
    return smoothBehaviorForElement[id];
  }
  function postScrollToParent(deltaX, deltaY) {
    parent.postMessage(
      {
        deltaX: deltaX,
        deltaY: deltaY,
        SS: "SmoothScroll",
      },
      "*"
    );
  }
  /***********************************************
   * HELPERS
   ***********************************************/
  function addEvent(type, fn, arg) {
    window.addEventListener(type, fn, arg || false);
  }
  function removeEvent(type, fn, arg) {
    window.removeEventListener(type, fn, arg || false);
  }
  function isNodeName(el, tag) {
    return el && (el.nodeName || "").toLowerCase() === tag.toLowerCase();
  }
  function directionCheck(x, y) {
    x = x > 0 ? 1 : -1;
    y = y > 0 ? 1 : -1;
    if (direction.x !== x || direction.y !== y) {
      direction.x = x;
      direction.y = y;
      que = [];
      lastScroll = 0;
      window.cancelAnimationFrame(pending);
      pending = null;
    }
  }
  function isTouchpad(deltaY) {
    if (!deltaY) return;
    if (!deltaBuffer.length) {
      deltaBuffer = [deltaY, deltaY, deltaY];
    }
    deltaY = Math.abs(deltaY);
    deltaBuffer.push(deltaY);
    deltaBuffer.shift();
    let dpiScaledWheelDelta = deltaY > 120 && allDeltasDivisableBy(deltaY); // win64
    let tp =
      !allDeltasDivisableBy(120) &&
      !allDeltasDivisableBy(100) &&
      !dpiScaledWheelDelta;
    if (deltaY < 50) tp = true;
    clearTimeout(deltaBufferTimer);
    deltaBufferTimer = setTimeout(function () {
      chrome.storage.local.set({
        deltaBuffer: deltaBuffer,
      });
      if (!tp)
        chrome.storage.local.set({
          lastDiscreetWheel: Date.now(),
        });
    }, 1000);
    return tp;
  }
  function isDivisible(n, divisor) {
    return Math.floor(n / divisor) == n / divisor;
  }
  function allDeltasDivisableBy(divisor) {
    return (
      isDivisible(deltaBuffer[0], divisor) &&
      isDivisible(deltaBuffer[1], divisor) &&
      isDivisible(deltaBuffer[2], divisor)
    );
  }
  chrome.storage.local.get("deltaBuffer", function (stored) {
    if (stored.deltaBuffer) {
      deltaBuffer = stored.deltaBuffer;
    }
  });
  function isInsideYoutubeVideo(event) {
    let elem = event.target;
    let isControl = false;
    if (document.URL.indexOf("www.youtube.com/watch") != -1) {
      do {
        isControl =
          elem.classList && elem.classList.contains("html5-video-controls");
        if (isControl) break;
      } while ((elem = elem.parentNode));
    }
    return isControl;
  }
  function getScrollRoot() {
    return document.scrollingElement || document.body; // scrolling root in WebKit
  }
  /***********************************************
   * PULSE (by Michael Herf)
   ***********************************************/
  /**
   * Viscous fluid with a pulse for part and decay for the rest.
   * - Applies a fixed force over an interval (a damped acceleration), and
   * - Lets the exponential bleed away the velocity over a longer interval
   * - Michael Herf, http://stereopsis.com/stopping/
   */
  function pulse_(x) {
    let val, start, expx;
    // test
    x = x * options.pulseScale;
    if (x < 1) {
      // acceleartion
      val = x - (1 - Math.exp(-x));
    } else {
      // tail
      // the previous animation ended here:
      start = Math.exp(-1);
      // simple viscous drag
      x -= 1;
      expx = 1 - Math.exp(-x);
      val = start + expx * (1 - start);
    }
    return val * options.pulseNormalize;
  }
  function pulse(x) {
    if (x >= 1) return 1;
    if (x <= 0) return 0;
    if (options.pulseNormalize == 1) {
      options.pulseNormalize /= pulse_(1);
    }
    return pulse_(x);
  }
  // new standard wheel event from Chrome 31+
  let wheelEvent =
    "onwheel" in document.createElement("div") ? "wheel" : "mousewheel";
  addEvent(wheelEvent, wheel, {
    passive: false,
  });
  addEvent("mousedown", mousedown);
  addEvent("keydown", keydown);
  addEvent("load", loaded);

  // =======================================================================
  // ============================ middlemouse.js ===========================
  // =======================================================================

  /**
   * A module for middle mouse scrolling.
   */
  const cleanupMiddlemouse = (function (window) {
    let defaultOptions = {
      middleMouse: false,
      frameRate: 200,
    };
    let options = defaultOptions;
    let img = document.createElement("div"); // img at the reference point
    let scrolling = false; // guards one phase
    // we check the OS for default middle mouse behavior only!
    let isLinux = navigator.platform.indexOf("Linux") != -1;
    // get global settings
    chrome.storage.sync.get(defaultOptions, function (syncedOptions) {
      options = syncedOptions;
      // leave time for the main script to check excluded pages
      setTimeout(function () {
        // if we shouldn't run, stop listening to events
        if (isExcluded && !options.middleMouse) {
          cleanup();
        }
      }, 10);
    });
    /**
     * Initializes the image at the reference point.
     */
    function init() {
      let url = chrome.runtime.getURL("../img/cursor.png");
      let style = img.style;
      style.background = "url(" + url + ") no-repeat";
      style.position = "fixed";
      style.zIndex = "1000";
      style.width = "20px";
      style.height = "20px";
      new Image().src = url; // force download
    }
    /**
     * Removes event listeners and other traces left on the page.
     */
    function cleanup() {
      removeEvent("mousedown", mousedown);
    }
    /**
     * Shows the reference image, and binds event listeners for scrolling.
     * It also manages the animation.
     * @param {Object} event
     */
    function mousedown(e) {
      // use default action if we're disabled
      // or it's not the midde mouse button
      if (!options.middleMouse || e.button !== 1) {
        return true;
      }
      let isLink = false;
      let elem = e.target;
      // linux middle mouse shouldn't be overwritten (paste)
      let isLinuxInput =
        isLinux &&
        (/input|textarea/i.test(elem.nodeName) || elem.isContentEditable);
      do {
        isLink = isNodeName(elem, "a");
        if (isLink) break;
      } while ((elem = elem.parentNode));
      elem = overflowingAncestor(e.target);
      // if it's being used on an <a> element
      // take the default action
      if (!elem || isLink || isLinuxInput) {
        return true;
      }
      // we don't want the default by now
      e.preventDefault();
      // quit if there's an ongoing scrolling
      if (scrolling) {
        return false;
      }
      // set up a new scrolling phase
      scrolling = true;
      // reference point
      img.style.left = e.clientX - 10 + "px";
      img.style.top = e.clientY - 10 + "px";
      document.body.appendChild(img);
      let refereceX = e.clientX;
      let refereceY = e.clientY;
      let speedX = 0;
      let speedY = 0;
      // animation loop
      let last = dateNow();
      let delay = 1000 / options.frameRate;
      let finished = false;
      window.requestAnimationFrame(
        function step(time) {
          let now = dateNow();
          let elapsed = now - last;
          // NOTE: later can also use document.scrollingElement
          if (elem == document.body) {
            window.scrollBy(speedX * elapsed, speedY * elapsed);
          } else {
            elem.scrollLeft += (speedX * elapsed) >> 0;
            elem.scrollTop += (speedY * elapsed) >> 0;
          }
          last = now;
          if (!finished) {
            window.requestAnimationFrame(step);
          }
        },
        elem,
        delay
      );
      let firstMove = true;
      function mousemove(e) {
        let deltaX = Math.abs(refereceX - e.clientX);
        let deltaY = Math.abs(refereceY - e.clientY);
        let movedEnough = Math.max(deltaX, deltaY) > 10;
        if (firstMove && movedEnough) {
          addEvent("mouseup", remove);
          firstMove = false;
        }
        speedX = ((e.clientX - refereceX) * 10) / 1000;
        speedY = ((e.clientY - refereceY) * 10) / 1000;
      }
      function remove(e) {
        removeEvent("mousemove", mousemove);
        removeEvent("mousedown", remove);
        removeEvent("mouseup", remove);
        removeEvent("keydown", remove);
        document.body.removeChild(img);
        scrolling = false;
        finished = true;
      }
      addEvent("mousemove", mousemove);
      addEvent("mousedown", remove);
      addEvent("keydown", remove);
    }
    /**
     * performance.now with fallback
     */
    let dateNow = (function () {
      return window.performance && performance.now
        ? function () {
            return performance.now();
          }
        : function () {
            return Date.now();
          };
    })();
    addEvent("mousedown", mousedown);
    addEvent("DOMContentLoaded", init);

    return cleanup;
  })(window);

  window.ufs_smoothScroll_disable = () => {
    cleanup();
    cleanupMiddlemouse();
  };
}
