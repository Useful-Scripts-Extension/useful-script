const UfsGlobal = {};

UfsGlobal.Extension = {
  // use basic customEvent technique - only communicate within the same document or window context
  sendToContentScript(event, data) {
    return new Promise((resolve, reject) => {
      let listenerKey = "ufs-contentscript-sendto-pagescript";
      let uuid = Math.random().toString(36);
      let listener = (evt) => {
        console.log(evt);
        if (evt.detail.event === event && evt.detail.uuid === uuid) {
          resolve(evt.detail.data);
          window.removeEventListener(listenerKey, listener);
        }
      };
      window.addEventListener(listenerKey, listener);
      window.dispatchEvent(
        new CustomEvent("ufs-pagescript-sendto-contentscript", {
          detail: { event, data, uuid },
        })
      );
    });
  },
  // WARNING: can only transfer serializable data
  async runInContentScript(fnPath, params) {
    return await UfsGlobal.Extension.sendToContentScript("runInContentScript", {
      fnPath,
      params,
    });
  },
  async backgroundFetch(url, options = {}) {
    return await UfsGlobal.Extension.runInContentScript("backgroundFetch", [
      url,
      options,
    ]);
  },
  async getURL(filePath) {
    return await UfsGlobal.Extension.runInContentScript(
      "chrome.runtime.getURL",
      [filePath]
    );
  },
  async getActiveScripts() {
    return await UfsGlobal.Extension.runInContentScript("getActiveScripts");
  },
};
UfsGlobal.DOM = {
  addLoadingAnimationAtPos(
    x,
    y,
    size = 40,
    containerStyle = "",
    loadingStyle = ""
  ) {
    let ele = document.createElement("div");
    ele.style.cssText = `
      position: absolute;
      left: ${x - size / 2}px;
      top: ${y - size / 2}px;
      width: ${size}px;
      height: ${size}px;
      z-index: 999999;
      pointer-events: none;
      user-select: none;
      ${containerStyle}
    `;
    UfsGlobal.DOM.addLoadingAnimation(ele, size, loadingStyle);
    document.body.appendChild(ele);
    return {
      ele,
      remove: () => ele.remove(),
    };
  },
  addLoadingAnimation(
    element,
    size = Math.min(element?.clientWidth, element?.clientHeight) || 0,
    customStyle = ""
  ) {
    let id = Math.random().toString(36).substr(2, 9);
    element.classList.add("ufs-loading-" + id);

    let borderSize = 4;

    // inject css code
    let style = document.createElement("style");
    style.id = "ufs-loading-style-" + id;
    style.textContent = `
      .ufs-loading-${id}::after {
        content: "";
        display: block;
        position: absolute;
        top: 50%;
        left: 50%;
        width: ${size}px;
        height: ${size}px;
        margin-top: -${size / 2}px;
        margin-left: -${size / 2}px;
        border-radius: 50%;
        border: ${borderSize}px solid #555 !important;
        border-top-color: #eee !important;
        animation: ufs-spin 1s ease-in-out infinite;
        box-sizing: border-box !important;
        ${customStyle}
      }
      @keyframes ufs-spin {
        to {
          transform: rotate(360deg);
        }
      }
      `;
    (document.head || document.documentElement).appendChild(style);

    return () => {
      if (element) element.classList.remove("ufs-loading-" + id);
    };
  },
  enableDragAndZoom(element, container, callback) {
    // set style
    element.style.cssText += `
        cursor: grab;
        position: relative;
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
        -khtml-user-select: none;
        max-width: unset !important;
        max-height: unset !important;
        min-width: unset !important;
        min-height: unset !important;
        -webkit-user-drag: none !important;
      `;

    // Variables to track the current position
    var lastX = 0;
    var lastY = 0;
    var dragging = false;
    let mouse = { x: 0, y: 0 };

    // Mouse down event listener
    (container || element).addEventListener("mousedown", function (e) {
      e.preventDefault();
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      element.style.cursor = "grabbing";
    });

    // Mouse move event listener
    document.addEventListener("mousemove", function (e) {
      mouse = { x: e.clientX, y: e.clientY };
      if (dragging) {
        let x = e.clientX - lastX + element.offsetLeft;
        let y = e.clientY - lastY + element.offsetTop;

        element.style.left = x + "px";
        element.style.top = y + "px";
        callback?.({ x, y, type: "move" });

        lastX = e.clientX;
        lastY = e.clientY;
      }
    });

    // Mouse up event listener
    document.addEventListener("mouseup", function () {
      dragging = false;
      element.style.cursor = "grab";
    });

    // Mouse leave event listener
    document.addEventListener("mouseleave", function () {
      dragging = false;
      element.style.cursor = "grab";
    });

    // Mouse wheel event listener for zooming
    (container || element).addEventListener("wheel", function (e) {
      e.preventDefault();
      var delta = Math.max(-1, Math.min(1, e.wheelDelta || -e.detail));
      var scaleFactor = 1.2;
      var scale = delta > 0 ? scaleFactor : 1 / scaleFactor;

      // Calculate mouse position relative to the container
      // var rect = container.getBoundingClientRect();
      // var mouseX = e.clientX - rect.left;
      // var mouseY = e.clientY - rect.top;

      // Adjust scale at mouse position
      var offsetX = mouse.x - element.offsetLeft;
      var offsetY = mouse.y - element.offsetTop;

      var newWidth = element.width * scale;
      var newHeight = element.height * scale;

      var newLeft =
        element.offsetLeft -
        (newWidth - element.width) * (offsetX / element.width);
      var newTop =
        element.offsetTop -
        (newHeight - element.height) * (offsetY / element.height);

      element.style.width = newWidth + "px";
      element.style.height = newHeight + "px";
      element.style.left = newLeft + "px";
      element.style.top = newTop + "px";

      callback?.({ type: "scale" });
    });
  },
  // prettier-ignore
  getContentClientRect(target) {
      var rect = target.getBoundingClientRect();
      var compStyle = window.getComputedStyle(target);
      var pFloat = parseFloat;
      var top = rect.top + pFloat(compStyle.paddingTop) + pFloat(compStyle.borderTopWidth);
      var right = rect.right - pFloat(compStyle.paddingRight) - pFloat(compStyle.borderRightWidth);
      var bottom = rect.bottom - pFloat(compStyle.paddingBottom) - pFloat(compStyle.borderBottomWidth);
      var left = rect.left + pFloat(compStyle.paddingLeft) + pFloat(compStyle.borderLeftWidth);
      return {
          top : top,
          right : right,
          bottom : bottom,
          left : left,
          width : right-left,
          height : bottom-top,
      };
    },
  dataURLToCanvas(dataurl, cb) {
    if (!dataurl) return cb(null);
    var ctx = canvas.getContext("2d");
    var img = new Image();
    img.setAttribute("crossOrigin", "anonymous");
    img.onload = function () {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      cb(canvas);
    };
    img.onerror = function () {
      cb(null);
    };
    img.src = dataurl;
  },
  notify({
    msg = "",
    x = window.innerWidth / 2,
    y = window.innerHeight - 100,
    align = "center",
    styleText = "",
    duration = 3000,
  } = {}) {
    let id = "ufs_notify_div";
    let exist = document.getElementById(id);
    if (exist) exist.remove();

    // create notify msg in website at postion, fade out animation, auto clean up
    let div = document.createElement("div");
    div.id = id;
    div.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        padding: 10px;
        background-color: #333;
        color: #fff;
        border-radius: 5px;
        z-index: 999999;
        transition: all 1s ease-out;
        ${
          align === "right"
            ? "transform: translateX(-100%);"
            : align === "center"
            ? "transform: translateX(-50%);"
            : ""
        }
        ${styleText || ""}
      `;
    div.textContent = msg;
    (document.body || document.documentElement).appendChild(div);

    let timeouts = [];
    function closeAfter(_time) {
      timeouts.forEach((t) => clearTimeout(t));
      timeouts = [
        setTimeout(() => {
          if (div) {
            div.style.opacity = 0;
            div.style.top = `${y - 50}px`;
          }
        }, _time - 1000),
        setTimeout(() => {
          div?.remove();
        }, _time),
      ];
    }

    closeAfter(duration);

    return {
      closeAfter: closeAfter,
      remove() {
        if (div) {
          div.remove();
          div = null;
          return true;
        }
        return false;
      },
      setText(text) {
        if (div) {
          div.textContent = text;
          return true;
        }
        return false;
      },
      setPosition(x, y) {
        if (div) {
          div.style.left = `${x}px`;
          div.style.top = `${y}px`;
          return true;
        }
        return false;
      },
    };
  },
  onDoublePress(key, callback, timeout = 500) {
    let timer = null;
    let clickCount = 0;

    const keyup = (event) => {
      if (event.key !== key) return;

      clickCount++;
      if (clickCount === 2) {
        callback?.();
        clickCount = 0;
        return;
      }

      clearTimeout(timer);
      timer = setTimeout(() => {
        clickCount = 0;
      }, timeout);
    };

    document.addEventListener("keyup", keyup);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("keyup", keyup);
    };
  }, // https://stackoverflow.com/a/3381522
  createFlashTitle(newMsg, howManyTimes) {
    var original = document.title;
    var timeout;

    function step() {
      document.title = document.title == original ? newMsg : original;
      if (--howManyTimes > 0) {
        timeout = setTimeout(step, 1000);
      }
    }
    howManyTimes = parseInt(howManyTimes);
    if (isNaN(howManyTimes)) {
      howManyTimes = 5;
    }
    clearTimeout(timeout);
    step();

    function cancel() {
      clearTimeout(timeout);
      document.title = original;
    }

    return cancel;
  },
  deleteElements(selector, willReRun) {
    UfsGlobal.DOM.onElementsVisible(
      selector,
      (nodes) => {
        [].forEach.call(nodes, function (node) {
          node.remove();
          console.log("Useful-scripts: element removed ", node);
        });
      },
      willReRun
    );
  },
  waitForElements(selector) {
    return new Promise((resolve, reject) => {
      UfsGlobal.DOM.onElementsVisible(selector, resolve, false);
    });
  }, // Idea from  https://github.com/gys-dev/Unlimited-Stdphim
  // https://stackoverflow.com/a/61511955/11898496
  onElementsVisible: (selector, callback, willReRun) => {
    let nodes = document.querySelectorAll(selector);
    if (nodes?.length) {
      callback(nodes);
      if (!willReRun) return;
    }

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (!mutation.addedNodes) return;

        for (let node of mutation.addedNodes) {
          if (node.nodeType != 1) continue; // only process Node.ELEMENT_NODE

          let n = node.matches(selector)
            ? [node]
            : Array.from(node.querySelectorAll(selector));

          if (n?.length) {
            callback(n);
            if (!willReRun) observer.disconnect();
          }
        }
      });
    });

    observer.observe(document, {
      childList: true,
      subtree: true,
      attributes: false,
      characterData: false,
    });

    // return disconnect function
    return () => observer.disconnect();
  },
  injectCssCode(code) {
    var css = document.createElement("style");
    if ("textContent" in css) css.textContent = code;
    else css.innerText = code;
    (document.head || document.documentElement).appendChild(css);
  },
  injectCssFile(filePath) {
    var css = document.createElement("link");
    css.setAttribute("rel", "stylesheet");
    css.setAttribute("type", "text/css");
    css.setAttribute("href", filePath);
    (document.head || document.documentElement).appendChild(css);
  },
  getTrustedPolicy() {
    let policy = window.trustedTypes?.ufsTrustedTypesPolicy || null;
    if (!policy) {
      policy = window.trustedTypes.createPolicy("ufsTrustedTypesPolicy", {
        createHTML: (string, sink) => string,
        createScriptURL: (string) => string,
        createScript: (string) => string,
      });
    }
    return policy;
  },
  createTrustedHtml(html) {
    let policy = UfsGlobal.DOM.getTrustedPolicy();
    return policy.createHTML(html);
  },
  injectScriptSrc(src, callback) {
    let policy = UfsGlobal.DOM.getTrustedPolicy();
    let jsSrc = policy.createScriptURL(src);
    let script = document.createElement("script");
    script.onload = function () {
      callback?.(true);
    };
    script.onerror = function (e) {
      callback?.(false, e);
    };
    script.src = jsSrc; // Assigning the TrustedScriptURL to src
    document.head.appendChild(script);
  },
  injectScriptSrcAsync(src) {
    return new Promise((resolve, reject) => {
      UfsGlobal.DOM.injectScriptSrc(src, (success, e) => {
        if (success) {
          resolve();
        } else {
          reject(e);
        }
      });
    });
  },
  isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.bottom > 0 &&
      rect.right > 0 &&
      rect.left < window.innerWidth &&
      rect.top < window.innerHeight
    );
  },
  getOverlapScore(el) {
    var rect = el.getBoundingClientRect();
    return (
      Math.min(
        rect.bottom,
        window.innerHeight || document.documentElement.clientHeight
      ) - Math.max(0, rect.top)
    );
  },
  makeUrlValid(url) {
    if (url.startsWith("//")) {
      url = "https:" + url;
    }
    return url;
  },
  async getWatchingVideoSrc() {
    const { getOverlapScore, isElementInViewport, makeUrlValid } =
      UfsGlobal.DOM;

    // video or xg-video tag
    let videos = Array.from(document.querySelectorAll("video, xg-video"));
    let sorted = videos
      .filter((v) => isElementInViewport(v))
      .sort((a, b) => {
        return getOverlapScore(b) - getOverlapScore(a);
      });

    for (let v of sorted) {
      if (v.src) return makeUrlValid(v.src);
      let sources = Array.from(v.querySelectorAll("source"));
      for (let s of sources) {
        if (s.src) return makeUrlValid(s.src);
      }
    }
  },
};
UfsGlobal.Utils = {
  // https://stackoverflow.com/a/67705964/23648002
  isEmoji(text) {
    return text?.match(
      /^(\u00a9|\u00ae|[\u25a0-\u27bf]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])+$/
    );
  },
  formatTimeToHHMMSSDD(date) {
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);
    const seconds = ("0" + date.getSeconds()).slice(-2);
    const milliseconds = ("00" + date.getMilliseconds()).slice(-3);
    return `${hours}:${minutes}:${seconds}:${milliseconds}`;
  },
  timeoutPromise(prom, time) {
    return Promise.race([
      prom,
      new Promise((_r, rej) => setTimeout(() => rej("time out " + time), time)),
    ]);
  },
  async getRedirectedUrl(url) {
    try {
      while (true) {
        let res = await UfsGlobal.Extension.backgroundFetch(url, {
          method: "HEAD",
        });
        if (res.redirected) {
          console.log("redirected:", url, "->", res.url);
          url = res.url;
        } else {
          return url;
        }
      }
    } catch (e) {
      console.log("ERROR:", e);
      return url;
    }
  },
  async getLargestImageSrc(imgSrc, webUrl) {
    if (/^data:/i.test(imgSrc)) {
      return null;
    }

    console.log(imgSrc);

    // bypass redirect
    let redirectedUrl = await UfsGlobal.Utils.getRedirectedUrl(imgSrc);
    if (redirectedUrl) {
      console.log("bypass redirect:", redirectedUrl);
      imgSrc = redirectedUrl;
    }

    function try1() {
      const url = new URL(imgSrc);
      switch (url.hostname) {
        // https://atlassiansuite.mservice.com.vn:8443/secure/useravatar?size=small&ownerId=JIRAUSER14656&avatarId=11605
        case "atlassiansuite.mservice.com.vn":
        case "atlassiantool.mservice.com.vn":
          if (url.href.includes("avatar")) {
            if (url.searchParams.get("size")) {
              url.searchParams.set("size", "256");
            } else {
              url.searchParams.append("size", "256");
            }
          }
          if (url.href.includes("/thumbnail/")) {
            return url.href.replace("/thumbnail/", "/attachments/");
          }
          if (url.href.includes("/thumbnails/")) {
            return url.href.replace("/thumbnails/", "/attachments/");
          }
          return url.toString();
      }
      return null;
    }

    function unique(array) {
      return Array.from(new Set(array));
    }

    function replace(str, r, s) {
      var results = [];

      if (!Array.isArray(r) && !Array.isArray(s)) {
        if (r && r.test && r.test(str)) {
          results.push(str.replace(r, s));
        }
      } else if (!Array.isArray(r) && Array.isArray(s)) {
        if (r && r.test && r.test(str)) {
          for (let si = 0; si < s.length; si++) {
            results.push(str.replace(r, s[si]));
          }
        }
      } else if (Array.isArray(r) && !Array.isArray(s)) {
        for (let ri = 0; ri < r.length; ri++) {
          let _r = r[ri];
          if (_r && _r.test && _r.test(str)) {
            results.push(str.replace(_r, s));
          }
        }
      } else if (Array.isArray(r) && Array.isArray(s)) {
        for (let ri = 0; ri < r.length; ri++) {
          let _r = r[ri];
          if (_r && _r.test && _r.test(str)) {
            let _s = Array.isArray(s[ri]) ? s[ri] : [s[ri]];
            for (let si = 0; si < _s.length; si++) {
              results.push(str.replace(_r, _s[si]));
            }
          }
        }
      }

      return unique(results);
    }

    function test(str, regexs) {
      if (!Array.isArray(regexs)) regexs = [regexs];
      for (let regex of regexs) {
        if (regex && regex.test && regex.test(str)) {
          return true;
        }
      }
      return false;
    }

    function try2() {
      for (let rule of UfsGlobal.largeImgSiteRules) {
        if (rule.url && !test(webUrl, rule.url)) continue;
        if (rule.src && !test(imgSrc, rule.src)) continue;
        if (rule.exclude && test(imgSrc, rule.exclude)) continue;
        if (rule.r) {
          console.log(rule);
          let newSrc = replace(imgSrc, rule.r, rule.s);
          if (newSrc?.length) {
            return newSrc;
          }
        }
      }
      return null;
    }

    // https://greasyfork.org/en/scripts/2312-resize-image-on-open-image-in-new-tab
    function try3() {
      return new Promise((resolve) => {
        var m = null;
        //google
        if (
          (m = imgSrc.match(
            /^(https?:\/\/lh\d+\.googleusercontent\.com\/.+\/)([^\/]+)(\/[^\/]+(\.(jpg|jpeg|gif|png|bmp|webp))?)(?:\?.+)?$/i
          ))
        ) {
          if (m[2] != "s0") {
            resolve(m[1] + "s0" + m[3]);
          }
        } else if (
          (m = imgSrc.match(
            /^(https?:\/\/lh\d+\.googleusercontent\.com\/.+=)(.+)(?:\?.+)?$/i
          ))
        ) {
          if (m[2] != "s0") {
            resolve(m[1] + "s0");
          }
        } else if (
          (m = imgSrc.match(
            /^(https?:\/\/\w+\.ggpht\.com\/.+\/)([^\/]+)(\/[^\/]+(\.(jpg|jpeg|gif|png|bmp|webp))?)(?:\?.+)?$/i
          ))
        ) {
          if (m[2] != "s0") {
            resolve(m[1] + "s0" + m[3]);
          }
        }

        //blogspot
        else if (
          (m = imgSrc.match(
            /^(https?:\/\/\w+\.bp\.blogspot\.com\/.+\/)([^\/]+)(\/[^\/]+(\.(jpg|jpeg|gif|png|bmp|webp))?)(?:\?.+)?$/i
          ))
        ) {
          if (m[2] != "s0") {
            resolve(m[1] + "s0" + m[3]);
          }
        }

        //tumblr
        else if (
          (m = imgSrc.match(
            /^(https?:\/\/\d+\.media\.tumblr\.com\/.*tumblr_\w+_)(\d+)(\.(jpg|jpeg|gif|png|bmp|webp))(?:\?.+)?$/i
          ))
        ) {
          if (m[2] < 1280) {
            var ajax = new XMLHttpRequest();
            ajax.onreadystatechange = function () {
              if (ajax.status == 200) {
                resolve(m[1] + "1280" + m[3]);
              }
            };
            ajax.open("HEAD", m[1] + "1280" + m[3], true);
            ajax.send();
          }
        }

        //twitter
        else if (
          (m = imgSrc.match(
            /^(https?:\/\/\w+\.twimg\.com\/media\/[^\/:]+)\.(jpg|jpeg|gif|png|bmp|webp)(:\w+)?$/i
          ))
        ) {
          var format = m[2];
          if (m[2] == "jpeg") format = "jpg";
          resolve(m[1] + "?format=" + format + "&name=orig");
        } else if (
          (m = imgSrc.match(/^(https?:\/\/\w+\.twimg\.com\/.+)(\?.+)$/i))
        ) {
          let url = new URL(webUrl);
          var pars = url.searchParams;
          if (!pars.format || !pars.name) return;
          if (pars.name == "orig") return;
          resolve(m[1] + "?format=" + pars.format + "&name=orig");
        }

        //Steam (Only user content)
        else if (
          (m = imgSrc.match(
            /^(https?:\/\/(images\.akamai\.steamusercontent\.com|steamuserimages-a\.akamaihd\.net)\/[^\?]+)\?.+$/i
          ))
        ) {
          resolve(m[1]);
        }

        //性浪微博
        else if (
          (m = imgSrc.match(
            /^(https?:\/\/(?:(?:ww|wx|ws|tvax|tva)\d+|wxt|wt)\.sinaimg\.(?:cn|com)\/)([\w\.]+)(\/.+)(?:\?.+)?$/i
          ))
        ) {
          if (m[2] != "large") {
            resolve(m[1] + "large" + m[3]);
          }
        }

        //zhihu
        else if (
          (m = imgSrc.match(
            /^(https?:\/\/.+\.zhimg\.com\/)(?:\d+\/)?([\w\-]+_)(\w+)(\.(jpg|jpeg|gif|png|bmp|webp))(?:\?.+)?$/i
          ))
        ) {
          if (m[3] != "r") {
            resolve(m[1] + m[2] + "r" + m[4]);
          }
        }

        //pinimg
        else if (
          (m = imgSrc.match(/^(https?:\/\/i\.pinimg\.com\/)(\w+)(\/.+)$/i))
        ) {
          if (m[2] != "originals") {
            resolve(m[1] + "originals" + m[3]);
          }
        } else if (
          (m = imgSrc.match(
            /^(https?:\/\/s-media[\w-]+\.pinimg\.com\/)(\w+)(\/.+)$/i
          ))
        ) {
          //need delete?
          if (m[2] != "originals") {
            resolve(m[1] + "originals" + m[3]);
          }
        }

        //bilibili
        else if (
          (m = imgSrc.match(
            /^(https?:\/\/\w+\.hdslb\.com\/.+\.(jpg|jpeg|gif|png|bmp|webp))(@|_).+$/i
          ))
        ) {
          resolve(m[1]);
        }

        //taobao(tmall)
        else if (
          (m = imgSrc.match(
            /^(https?:\/\/(?:.+?)\.alicdn\.com\/.+\.(jpg|jpeg|gif|png|bmp|webp))_.+$/i
          ))
        ) {
          resolve(m[1]);
        }

        //jd
        else if (
          (m = imgSrc.match(
            /^(https?:\/\/(?:img\d+)\.360buyimg\.com\/)((?:.+?)\/(?:.+?))(\/(?:.+?))(\!.+)?$/i
          ))
        ) {
          if (m[2] != "sku/jfs") {
            resolve(m[1] + "sku/jfs" + m[3]);
          }
        }

        // https://s01.riotpixels.net/data/2a/b2/2ab23684-6cec-41da-9bce-f72c5264353a.jpg.240p.jpg
        else if (
          (m = imgSrc.match(
            /^(https?:\/\/(?:.+?)\.riotpixels\.net\/.+\.(jpg|jpeg|gif|png|bmp|webp))\..+?$/i
          ))
        ) {
          resolve(m[1]);
        }

        // reddit NEED TEST
        else if (
          (m = imgSrc.match(
            /^https?:\/\/preview\.redd\.it\/(.+\.(jpg|jpeg|gif|png|bmp|webp))\?.+?$/i
          ))
        ) {
          resolve("https://i.redd.it/" + m[1]);
        }

        // akamaized.net/imagecache NEED TEST
        else if (
          (m = imgSrc.match(
            /^(https:\/\/.+\.akamaized\.net\/imagecache\/\d+\/\d+\/\d+\/\d+\/)(\d+)(\/.+)$/i
          ))
        ) {
          if (m[2] < 1920) resolve(m[1] + "1920" + m[3]);
        }

        // 微信公众号 by sbdx
        else if (
          (m = imgSrc.match(
            /^(https:\/\/mmbiz\.qpic\.cn\/mmbiz_jpg\/.+?\/)(\d+)(\?wx_fmt=jpeg)/i
          ))
        ) {
          if (m[2] != 0) resolve(m[1] + "0" + m[3]);
        }

        //百度贴吧（然而对于画质提升什么的并没有什么卵用...）
        else if (
          (m = imgSrc.match(
            /^https?:\/\/imgsrc\.baidu\.com\/forum\/pic\/item\/.+/i
          ))
        ) {
          if (
            (m = imgSrc.match(
              /^(https?):\/\/(?:imgsrc|imgsa|\w+\.hiphotos)\.(?:bdimg|baidu)\.com\/(?:forum|album)\/.+\/(\w+\.(?:jpg|jpeg|gif|png|bmp|webp))(?:\?.+)?$/i
            ))
          ) {
            resolve(m[1] + "://imgsrc.baidu.com/forum/pic/item/" + m[2]);
          }
          //if( (m = imgSrc.match(/^(https?)(:\/\/(?:imgsrc|imgsa|\w+\.hiphotos|tiebapic)\.(?:bdimg|baidu)\.com\/)(?:forum|album)\/.+\/(\w+\.(?:jpg|jpeg|gif|png|bmp|webp))(?:\?.+)?$/i)) ){
          //	resolve(m[1] + m[2] + "forum/pic/item/" + m[3])
          //}
        } else {
          resolve(null);
        }
      });
    }

    for (let fn of [try1, try2, try3]) {
      try {
        let res = await UfsGlobal.Utils.timeoutPromise(fn(), 5000);
        console.log("getLargestImageSrc: " + fn.name + " -> ", res);
        if (res && res != imgSrc) {
          if (!Array.isArray(res)) res = [res];
          if (res.length) {
            let finalSrc = await UfsGlobal.Utils.findWorkingSrc(res, true);
            console.log("final src:", finalSrc);
            if (finalSrc?.length) return finalSrc;
          }
        }
      } catch (e) {
        console.log("ERROR getLargestImageSrc: " + fn.name + " -> ", e);
      }
    }

    return null;
  },
  async isImageSrc(src) {
    try {
      const res = await UfsGlobal.Extension.backgroundFetch(src, {
        method: "HEAD",
      });
      console.log("isImageSrc: " + src + " -> ", res);
      if (res.ok) {
        // const type = res.headers.get("content-type");
        const type = res.headers?.["content-type"];
        if (type && type.startsWith("image/")) {
          return true;
        }
      }
    } catch (error) {
      console.log("ERROR isImageSrc: " + src + " -> ", error);
    }

    return new Promise((resolve) => {
      let img = new Image();
      img.src = src;
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
    });
  },
  findWorkingSrc(srcs, inOrder = true) {
    return new Promise((resolve, reject) => {
      if (!srcs || !Array.isArray(srcs) || srcs.length === 0) {
        reject("srcs is falsy, not an array, or empty");
      } else {
        const checkImage = (src) =>
          // prevent Error: Content Security Policy directive: "connect-src 'self'
          UfsGlobal.Utils.isImageSrc(src).then((value) => {
            if (inOrder) return value;
            if (value) resolve(src);
            return value;
          });

        const promises = srcs.map(checkImage);
        Promise.all(promises).then((res) => {
          let trueIndex = res.indexOf(true);
          if (trueIndex > -1) {
            resolve(srcs[trueIndex]);
          } else {
            reject("none of the URLs are valid images");
          }
        });
      }
    });
  },
  // resolve relative URLs into canonical absolute URLs based on the current location.
  canonicalUri(src, location = window.location) {
    if (src.charAt(0) == "#") return location.href + src;
    if (src.charAt(0) == "?")
      return location.href.replace(/^([^\?#]+).*/, "$1" + src);
    var root_page = /^[^?#]*\//.exec(location.href)[0],
      base_path = location.pathname.replace(/\/[^\/]+\.[^\/]+$/, "/"),
      root_domain = /^\w+\:\/\/\/?[^\/]+/.exec(root_page)[0],
      absolute_regex = /^\w+\:\/\//;
    src = src.replace("./", "");
    if (/^\/\/\/?/.test(src)) {
      src = location.protocol + src;
    } else if (!absolute_regex.test(src) && src.charAt(0) != "/") {
      src = (base_path || "") + src;
    }
    return absolute_regex.test(src)
      ? src
      : (src.charAt(0) == "/" ? root_domain : root_page) + src;
  },
  formatSize(size, fixed = 0) {
    size = Number(size);
    if (!size) return "?";

    const units = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    return size.toFixed(fixed) + units[unitIndex];
  },
  // modified by chatgpt based on: https://gist.github.com/jcouyang/632709f30e12a7879a73e9e132c0d56b
  promiseAllStepN(n, list) {
    const head = list.slice(0, n);
    const tail = list.slice(n);
    const resolved = [];
    return new Promise((resolve) => {
      let processed = 0;
      function runNext() {
        if (processed === tail.length) {
          resolve(Promise.all(resolved));
          return;
        }
        const promise = tail[processed]();
        resolved.push(
          promise.then((result) => {
            runNext();
            return result;
          })
        );
        processed++;
      }
      head.forEach((func) => {
        const promise = func();
        resolved.push(
          promise.then((result) => {
            runNext();
            return result;
          })
        );
      });
    });
  },
  hook(obj, name, callback) {
    const orig = obj[name];
    obj[name] = function (...args) {
      const result = orig.apply(this, args);
      callback?.({
        this: this,
        args: args,
        result: result,
      });
      return result;
    };
    return () => {
      // restore
      obj[name] = orig;
    };
  },
  // https://stackoverflow.com/a/38552302/11898496
  parseJwt(token) {
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  },
  copyToClipboard(text) {
    // Check if Clipboard API is supported
    if (!navigator.clipboard) {
      alert("Clipboard API not supported, falling back to older method.");
      function fallbackCopyToClipboard(text) {
        const tempInput = document.createElement("input");
        tempInput.value = text;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
        console.log("Text copied to clipboard (fallback method)");
      }
      return fallbackCopyToClipboard(text);
    }

    // Copy text to clipboard
    navigator.clipboard
      .writeText(text)
      .then(() => {
        console.log("Text copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy text to clipboard:", err);
      });
  },
  // https://stackoverflow.com/a/7960435
  isEmptyFunction(func) {
    try {
      var m = func.toString().match(/\{([\s\S]*)\}/m)[1];
      return !m.replace(/^\s*\/\/.*$/gm, "");
    } catch (e) {
      console.log("Error isEmptyFunction", e);
      return false;
    }
  },
  // https://stackoverflow.com/a/9310752
  escapeRegExp(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  },
  // https://stackoverflow.com/q/38849009
  unescapeRegExp(text) {
    return text.replace(/\\(.)/g, "$1");
  },
  encodeQueryString(obj) {
    var str = [];
    for (var p in obj)
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    return str.join("&");
  },
  moneyFormat(number, fixed = 0) {
    if (isNaN(number)) return 0;
    number = number.toFixed(fixed);
    let delimeter = ",";
    number += "";
    let rgx = /(\d+)(\d{3})/;
    while (rgx.test(number)) {
      number = number.replace(rgx, "$1" + delimeter + "$2");
    }
    return number;
  },
  zipAndDownloadBlobs(
    blobList,
    zipFileName,
    progressCallback,
    successCallback
  ) {
    const zip = new JSZip();

    // Add each Blob to the ZIP archive with a unique name
    blobList.forEach(({ blob, fileName }, index) => {
      console.log(fileName);
      zip.file(fileName, blob);
    });

    // Generate the ZIP content with progress callback
    zip
      .generateAsync({ type: "blob" }, (metadata) => {
        if (progressCallback) {
          // Calculate progress as a percentage
          const progress = metadata.percent | 0;
          progressCallback(progress);
        }
      })
      .then((content) => {
        successCallback?.();

        // Create a link to trigger the download
        const a = document.createElement("a");
        a.href = URL.createObjectURL(content);
        a.download = zipFileName;

        // Trigger a click event to initiate the download
        a.click();
      });
  },
  async getBlobFromUrl(url) {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      return blob;
    } catch (error) {
      alert("Error: " + error);
    }
  },
  async getBlobFromUrlWithProgress(url, progressCallback) {
    const response = await fetch(url, {});
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    const contentLength = response.headers.get("content-length");
    const total = parseInt(contentLength, 10);
    let loaded = 0;
    const reader = response.body.getReader();
    const chunks = [];

    const startTime = Date.now();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      loaded += value.byteLength;
      const ds = (Date.now() - startTime + 1) / 1000;
      progressCallback?.({
        loaded,
        total,
        speed: loaded / ds,
      });
      chunks.push(value);
    }

    const blob = new Blob(chunks, {
      type: response.headers.get("content-type"),
    });

    return blob;
  },
  async downloadBlobUrl(url, title) {
    try {
      let res = await fetch(url);
      let blob = await res.blob();
      UfsGlobal.Utils.downloadBlob(blob, title);
    } catch (e) {
      alert("Error: " + e);
    }
  },
  downloadBlob(blob, filename) {
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = filename;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
  },
  // https://stackoverflow.com/a/15832662/11898496
  // TODO: chrome.downloads: https://developer.chrome.com/docs/extensions/reference/downloads/#method-download
  downloadURL(url, name) {
    var link = document.createElement("a");
    link.target = "_blank";
    link.download = name;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
  downloadData(data, filename, type = "text/plain") {
    var file = new Blob([data], { type: type });
    if (window.navigator.msSaveOrOpenBlob)
      window.navigator.msSaveOrOpenBlob(file, filename);
    else {
      var a = document.createElement("a"),
        url = URL.createObjectURL(file);
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(function () {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 0);
    }
  },
};
UfsGlobal.Facebook = {
  // Helpers
  async fetchGraphQl(str, fb_dtsg) {
    var fb_dtsg = "fb_dtsg=" + encodeURIComponent(fb_dtsg);
    fb_dtsg += str.includes("variables")
      ? "&" + str
      : "&q=" + encodeURIComponent(str);

    let res = await fetch("https://www.facebook.com/api/graphql/", {
      body: fb_dtsg,
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      credentials: "include",
    });

    let json = await res.json();
    return json;
  },
  decodeArrId(arrId) {
    return arrId[0] * 4294967296 + arrId[1];
  },
  async getFbdtsg() {
    let methods = [
      () => require("DTSGInitData").token,
      () => require("DTSG").getToken(),
      () => {
        return document.documentElement.innerHTML.match(
          /"DTSGInitialData",\[],{"token":"(.+?)"/gm
        )[1];
      },
      async () => {
        let res = await fetch("https://mbasic.facebook.com/photos/upload/");
        let text = await res.text();
        return text.match(/name="fb_dtsg" value="(.*?)"/)[1];
      },
      () => require("DTSG_ASYNC").getToken(), // TODO: trace xem tại sao method này trả về cấu trúc khác 2 method trên
    ];
    for (let m of methods) {
      try {
        let d = await m();
        if (d) return d;
      } catch (e) {}
    }
    return null;
  },
  // User Data
  getUserAvatarFromUid(uid) {
    return (
      "https://graph.facebook.com/" +
      uid +
      "/picture?height=500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662"
    );
  },
  async getYourUserId() {
    let methods = [
      () => require("CurrentUserInitialData").USER_ID,
      () => require("RelayAPIConfigDefaults").actorID,
      () => document.cookie.match(/c_user=(\d+)/)[1],
      async () =>
        (
          await chrome.cookies.get({
            url: "https://www.facebook.com",
            name: "c_user",
          })
        ).value,
    ];
    for (let m of methods) {
      try {
        let d = await m();
        if (d) return d;
      } catch (e) {}
    }
    return null;
  },
  async getUserInfoFromUid(uid) {
    const variables = {
      userID: uid,
      shouldDeferProfilePic: false,
      useVNextHeader: false,
      scale: 1.5,
    };
    let f = new URLSearchParams();
    f.append("fb_dtsg", await UfsGlobal.Facebook.getFbdtsg());
    f.append("fb_api_req_friendly_name", "ProfileCometHeaderQuery");
    f.append("variables", JSON.stringify(variables));
    f.append("doc_id", "4159355184147969");

    let res = await fetch("https://www.facebook.com/api/graphql/", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: f,
    });

    let text = await res.text();
    return {
      uid: uid,
      name: UfsGlobal.DEBUG.decodeEscapedUnicodeString(
        /"name":"(.*?)"/.exec(text)?.[1]
      ),
      avatar: UfsGlobal.DEBUG.decodeEscapedUnicodeString(
        /"profilePicLarge":{"uri":"(.*?)"/.exec(text)?.[1] ||
          /"profilePicMedium":{"uri":"(.*?)"/.exec(text)?.[1] ||
          /"profilePicSmall":{"uri":"(.*?)"/.exec(text)?.[1] ||
          /"profilePic160":{"uri":"(.*?)"/.exec(text)?.[1]
      ),
      gender: /"gender":"(.*?)"/.exec(text)?.[1],
      alternateName: /"alternate_name":"(.*?)"/.exec(text)?.[1],
    };
  },
  async getUserInfo(uid, access_token) {
    var n =
      "https://graph.facebook.com/" +
      encodeURIComponent(uid) +
      "/?fields=name,picture&access_token=" +
      access_token;
    const e = await fetch(n);
    let json = await e.json();

    return {
      uid: uid,
      name: json?.name,
      avatar: json?.picture?.data?.url,
    };
  },
  async getUidFromUrl(url) {
    let methods = [
      () => require("CometRouteStore").getRoute(url).rootView.props.userID,
      async () => {
        var response = await fetch(url);
        if (response.status == 200) {
          var text = await response.text();
          let uid = /(?<=\"userID\"\:\")(.\d+?)(?=\")/.exec(text);
          if (uid?.length) {
            return uid[0];
          }
        }
        return null;
      },
    ];

    for (let m of methods) {
      try {
        let uid = await m();
        if (uid) return uid;
      } catch (e) {}
    }
    return null;
  },
  // Story
  getStoryBucketIdFromURL(url) {
    return url.match(/stories\/(\d+)\//)?.[1];
  },
  getStoryId() {
    const htmlStory = document.getElementsByClassName(
      "xh8yej3 x1n2onr6 xl56j7k x5yr21d x78zum5 x6s0dn4"
    );
    return htmlStory[htmlStory.length - 1].getAttribute("data-id");
  },
  async getStoryInfo(bucketID, fb_dtsg) {
    // Source: https://pastebin.com/CNvUxpfc
    let body = new URLSearchParams();
    body.append("__a", 1);
    body.append("fb_dtsg", fb_dtsg);
    body.append(
      "variables",
      JSON.stringify({
        bucketID: bucketID,
        initialLoad: false,
        scale: 1,
      })
    );
    body.append("doc_id", 2586853698032602);

    let res = await fetch("https://www.facebook.com/api/graphql/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body,
      credentials: "include",
    });

    let json = await res.json();
    console.log(json);
    let data = json?.data?.bucket;

    if (!data) throw new Error("Không lấy được data");
    return {
      storyId: data.id,
      author: {
        id: data.owner.id,
        name: data.owner.name,
        avatar: data.owner.profile_picture.uri,
        avatarURL: data.owner.url,
      },
      Objects: data.unified_stories.edges.map((_, i) => {
        return {
          pictureBlurred:
            data.unified_stories.edges[i].node.attachments[0].media.blurredImage
              .uri,
          picturePreview:
            data.unified_stories.edges[i].node.attachments[0].media.previewImage
              .uri,
          totalReaction:
            data.unified_stories.edges[i].node.story_card_info.feedback_summary
              .total_reaction_count,
          backgroundCss:
            data.unified_stories.edges[i].node.story_default_background.color,
          backgroundCss3:
            data.unified_stories.edges[i].node.story_default_background.gradient
              .css,
          ...(data.unified_stories.edges[i].node.attachments[0].media
            .__typename == "Photo"
            ? {
                caption:
                  data.unified_stories.edges[i].node.attachments[0].media
                    .accessibility_caption,
                image:
                  data.unified_stories.edges[i].node.attachments[0].media.image
                    .uri,
              }
            : data.unified_stories.edges[i].node.attachments[0].media
                .__typename == "Video"
            ? {
                permanlinkUrl:
                  data.unified_stories.edges[i].node.attachments[0].media
                    .permalink_url,
                playableVideo:
                  data.unified_stories.edges[i].node.attachments[0].media
                    .playable_url,
                playableUrlDash:
                  data.unified_stories.edges[0].node.attachments[0].media
                    .playable_url_dash,
                playableUrlHDString:
                  data.unified_stories.edges[i].node.attachments[0].media
                    .playableUrlHdString,
                playableUrlHD:
                  data.unified_stories.edges[i].node.attachments[0].media
                    .playable_url_quality_hd,
              }
            : null),
        };
      }),
    };

    // let data =
    //   "__a=1&fb_dtsg=" +
    //   dtsg +
    //   "&variables=%7B%22bucketID%22%3A%22" +
    //   bucketID +
    //   "%22%2C%22initialLoad%22%3Afalse%2C%22scale%22%3A1%7D&doc_id=2586853698032602";

    // let xhr = new XMLHttpRequest();
    // xhr.withCredentials = true;
    // xhr.addEventListener("readystatechange", function () {
    //   if (this.readyState === 4) {

    //   }
    // });

    // xhr.open("POST", "https://www.facebook.com/api/graphql/");
    // xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    // xhr.send(body);
  },
  // Friend
  async removeFriendConfirm(friend_uid, uid, fb_dtsg) {
    var f = new FormData();
    f.append("uid", friend_uid),
      f.append("unref", "bd_friends_tab"),
      f.append("floc", "friends_tab"),
      f.append("__user", uid),
      f.append("__a", 1),
      f.append("fb_dtsg", fb_dtsg);
    await fetch(
      "https://www.facebook.com/ajax/ajax/profile/removefriendconfirm.php?dpr=1",
      {
        method: "POST",
        credentials: "include",
        body: f,
      }
    );
  },
  async fetchAddedFriends(uid, fb_dtsg, cursor) {
    let variables = JSON.stringify({
      count: 8,
      cursor: cursor ?? null,
      category_key: "FRIENDS",
    });
    const t = new URLSearchParams();
    t.append("__user", uid),
      t.append("__a", 1),
      t.append("dpr", 1),
      t.append("fb_dtsg", fb_dtsg),
      t.append("fb_api_caller_class", "RelayModern"),
      t.append("fb_api_req_friendly_name", "ActivityLogStoriesQuery"),
      t.append("doc_id", "2761528123917382"),
      t.append("variables", variables);

    let res = await fetch("https://www.facebook.com/api/graphql/", {
      method: "POST",
      body: t,
    });
    let json = await res.json();

    let { edges, page_info } =
      json.data.viewer.activity_log_actor.activity_log_stories;

    return {
      nextCursor: page_info.end_cursor,
      data: edges
        .map((e) => {
          if (
            "UNFRIEND" === e.curation_options[0] ||
            e.node.attachments.length
          ) {
            return {
              uid: e.node.attachments[0].target.id,
              name: e.node.attachments[0].title_with_entities.text,
              avatar: e.node.attachments[0].media.image.uri,
              addedTime: 1e3 * e.node.creation_time,
            };
          }
          return null;
        })
        .filter((_) => _),
    };
  },
  async fetchAllAddedFriendsSince(uid, fb_dtsg, since, pageFetchedCallback) {
    let cursor = "";
    let allFriends = [];
    try {
      while (true) {
        let { nextCursor, data } = await UfsGlobal.Facebook.fetchAddedFriends(
          uid,
          fb_dtsg,
          cursor
        );
        cursor = nextCursor;
        allFriends = allFriends.concat(data);
        await pageFetchedCallback?.(data, allFriends);

        if (!nextCursor || (since && nextCursor < since)) break;
      }
    } catch (e) {
      console.log("ERROR fetch all added friends", e);
    }
    return allFriends;
  },
  // Messages
  async messagesCount(fb_dtsg) {
    return await UfsGlobal.Facebook.fetchGraphQl(
      "viewer(){message_threads{count,nodes{customization_info{emoji,outgoing_bubble_color,participant_customizations{participant_id,nickname}},all_participants{nodes{messaging_actor{name,id,profile_picture}}},thread_type,name,messages_count,image,id}}}",
      fb_dtsg
    );
  },
  // Page
  async unlikePage(pageId, uid, fb_dtsg) {
    var f = new FormData();
    f.append("fbpage_id", pageId),
      f.append("add", false),
      f.append("reload", false),
      f.append("fan_origin", "page_timeline"),
      f.append("__user", uid),
      f.append("__a", 1),
      f.append("fb_dtsg", fb_dtsg);
    await fetch("https://www.facebook.com/ajax/pages/fan_status.php?dpr=1", {
      method: "POST",
      credentials: "include",
      body: f,
    });
  },
  async searchPageForOther(other_uid, cursor, uid, fb_dtsg) {
    let variables = JSON.stringify({
      count: 8,
      scale: 1,
      cursor: cursor ?? null,
      id: btoa(`app_collection:${other_uid}:2409997254:96`),
    });

    let f = new URLSearchParams();
    f.append("__user", uid);
    f.append("__a", 1);
    f.append("dpr", 1);
    f.append("fb_dtsg", fb_dtsg);
    f.append("fb_api_caller_class", "RelayModern");
    f.append(
      "fb_api_req_friendly_name",
      "ProfileCometAppCollectionGridRendererPaginationQuery"
    );
    f.append("variables", variables);
    f.append("doc_id", 2983410188445167);

    try {
      let res = await fetch("https://www.facebook.com/api/graphql/", {
        method: "POST",
        body: f,
      });

      let json = await res.json();
      let { items } = json.data.node;
      return {
        nextCursor: items.page_info.end_cursor,
        data: items.edges.map((e) => ({
          id: e.node.node?.id || btoa(e.node.id).split(":").at(-1),
          name: e.node.title.text,
          subTitle: e.node.subtitle_text?.text,
          url: e.node.url,
          image: e.node.image.uri,
          cursor: e.cursor,
        })),
        totalCount: items.count,
      };
    } catch (e) {
      console.log("ERROR fetch page", e);
      return {
        nextCursor: null,
        data: [],
        totalCount: 0,
      };
    }
  },
  async searchAllPageForOther(other_uid, uid, fb_dtsg, pageFetchedCallback) {
    let cursor = "";
    let allPages = [];
    try {
      while (true) {
        let { nextCursor, data, totalCount } =
          await UfsGlobal.Facebook.searchPageForOther(
            other_uid,
            cursor,
            uid,
            fb_dtsg
          );
        cursor = nextCursor;
        allPages = allPages.concat(data);
        await pageFetchedCallback?.(data, allPages, totalCount);

        if (!cursor) break;
      }
    } catch (e) {
      console.log("ERROR search all page for other", e);
    }
    return allPages;
  },
  // Group
  async leaveGroup(groupId, uid, fb_dtsg) {
    var f = new FormData();
    f.append("fb_dtsg", fb_dtsg),
      f.append("confirmed", 1),
      f.append("__user", uid),
      f.append("__a", 1);
    await fetch(
      "https://www.facebook.com/ajax/groups/membership/leave.php?group_id=" +
        groupId +
        "&dpr=1",
      {
        method: "POST",
        credentials: "include",
        body: f,
      }
    );
  },
  async searchGroupForOther(other_uid, cursor, uid, fb_dtsg) {
    let variables = JSON.stringify({
      count: 8,
      cursor: cursor ?? null,
      id: btoa(`app_collection:${other_uid}:2361831622:66`),
    });

    let f = new URLSearchParams();
    f.append("__user", uid);
    f.append("__a", 1);
    f.append("dpr", 1);
    f.append("fb_dtsg", fb_dtsg);
    f.append("fb_api_caller_class", "RelayModern");
    f.append(
      "fb_api_req_friendly_name",
      "ProfileCometAppCollectionGridRendererPaginationQuery"
    );
    f.append("variables", variables);
    f.append("doc_id", 5244211935648733);

    try {
      let res = await fetch("https://www.facebook.com/api/graphql/", {
        method: "POST",
        body: f,
      });

      let json = await res.json();
      let { pageItems } = json.data.node;
      return {
        nextCursor: pageItems.page_info.end_cursor,
        data: pageItems.edges.map((e) => ({
          id: e.node.node?.id || btoa(e.node.id).split(":").at(-1),
          title: e.node.title.text,
          subTitle: e.node.subtitle_text?.text,
          url: e.node.url,
          visibility: e.node.node.visibility,
          image: e.node.image.uri,
          membersCount: Number(
            // e.node.node.forum_member_profiles.formatted_count_text ||
            // e.node.node.group_member_profiles.formatted_count_text
            (e.node.subtitle_text.text.split("\n")?.[0] || "")
              .match(/\d+/g)
              .join("") ?? 1
          ),
          cursor: e.cursor,
        })),
      };
    } catch (e) {
      console.log("ERROR fetch page", e);
      return {
        nextCursor: null,
        data: [],
      };
    }
  },
  async searchAllGroupForOther(other_uid, uid, fb_dtsg, pageFetchedCallback) {
    let cursor = "";
    let allGroups = [];
    try {
      while (true) {
        let { nextCursor, data } = await UfsGlobal.Facebook.searchGroupForOther(
          other_uid,
          cursor,
          uid,
          fb_dtsg
        );
        cursor = nextCursor;
        allGroups = allGroups.concat(data);
        await pageFetchedCallback?.(data, allGroups);

        if (!cursor) break;
      }
    } catch (e) {
      console.log("ERROR search all group for other", e);
    }
    return allGroups;
  },
};
UfsGlobal.Tiktok = {
  downloadTiktokVideoFromId: async function (videoId) {
    for (let api of [
      "https://api22-normal-c-useast2a.tiktokv.com/aweme/v1/feed/?aweme_id=",
      "https://api16-normal-useast5.us.tiktokv.com/aweme/v1/feed/?aweme_id=",
      "https://api16-normal-c-useast1a.tiktokv.com/aweme/v1/feed/?aweme_id=",
      "https://api2.musical.ly/aweme/v1/feed/?aweme_id=",
    ]) {
      try {
        const ts = Math.round(Date.now() / 1000);
        const parameters = {
          aweme_id: videoId,
          // version_name: appVersion,
          // version_code: manifestAppVersion,
          // build_number: appVersion,
          // manifest_version_code: manifestAppVersion,
          // update_version_code: manifestAppVersion,
          // openudid: UTIL.ranGen("0123456789abcdef", 16),
          // uuid: UTIL.ranGen("0123456789", 16),
          _rticket: ts * 1000,
          ts: ts,
          device_brand: "Google",
          device_type: "Pixel 4",
          device_platform: "android",
          resolution: "1080*1920",
          dpi: 420,
          os_version: "10",
          os_api: "29",
          carrier_region: "US",
          sys_region: "US",
          region: "US",
          app_name: "trill",
          app_language: "en",
          language: "en",
          timezone_name: "America/New_York",
          timezone_offset: "-14400",
          channel: "googleplay",
          ac: "wifi",
          mcc_mnc: "310260",
          is_my_cn: 0,
          aid: 1180,
          ssmix: "a",
          as: "a1qwert123",
          cp: "cbfhckdckkde1",
        };
        const params = Object.keys(parameters)
          .map((key) => `&${key}=${parameters[key]}`)
          .join("");
        let data = await fetch(api + videoId + "&" + params);
        let json = await data.json();
        console.log(json);
        let item = json.aweme_list.find((a) => a.aweme_id == videoId);
        if (!item) throw Error("Không tìm thấy video");
        let url =
          item?.video?.play_addr?.url_list?.[0] ||
          item?.video?.download_addr?.url_list?.[0];
        if (url) return url;
      } catch (e) {
        console.log("ERROR: " + e);
      }
    }
    return null;
  },
  CACHE: {
    snapTikToken: null,
  },
  downloadTiktokVideoFromUrl: async function (url) {
    try {
      let token = UfsGlobal.Tiktok.CACHE.snapTikToken;
      if (!token) {
        let token = await UfsGlobal.SnapTik.getToken();
        if (!token) throw Error("Không tìm thấy token snaptik");
        UfsGlobal.Tiktok.CACHE.snapTikToken = token;
      }

      let data = new FormData();
      data.append("url", url);
      data.append("token", token);

      let res = await fetch("https://snaptik.app/abc2.php", {
        method: "POST",
        body: data,
      });
      let text = await res.text();
      let result = UfsGlobal.SnapTik.decode(text);
      return result;
    } catch (e) {
      console.log("ERROR: " + e);
    }
  },
};
UfsGlobal.SnapTik = {
  getToken: async () => {
    let res = await fetch("https://snaptik.app/");
    let text = await res.text();
    let token = text.match(/name="token" value="(.+?)"/)?.[1];
    return token;
  },
  decode: (encoded) => {
    function b(d, e, f) {
      var g =
        "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/".split(
          ""
        );
      var h = g.slice(0, e);
      var i = g.slice(0, f);
      var j = d
        .split("")
        .reverse()
        .reduce(function (a, b, c) {
          if (h.indexOf(b) !== -1) return (a += h.indexOf(b) * Math.pow(e, c));
        }, 0);
      var k = "";
      while (j > 0) {
        k = i[j % f] + k;
        j = (j - (j % f)) / f;
      }
      return k || 0;
    }
    function c(h, u, n, t, e, r) {
      r = "";
      for (var i = 0, len = h.length; i < len; i++) {
        var s = "";
        while (h[i] !== n[e]) {
          s += h[i];
          i++;
        }
        for (var j = 0; j < n.length; j++)
          s = s.replace(new RegExp(n[j], "g"), j);
        r += String.fromCharCode(b(s, e, 10) - t);
      }
      return decodeURIComponent(escape(r));
    }

    let params = encoded.match(/}\((.*?)\)\)/)?.[1];
    params = params.split(",").map((_) => {
      if (!isNaN(Number(_))) return Number(_);
      if (_.startsWith('"')) return _.slice(1, -1);
      return _;
    });

    let result = c(...params);
    let jwt = result.match(/d\?token=(.*?)\&dl=1/)?.[1];
    let payload = UfsGlobal.Utils.parseJwt(jwt);
    return payload?.url;
  },
};
UfsGlobal.Origin = {
  consoleLog: console.log,
};
UfsGlobal.DEBUG = {
  // Có trang web tự động xoá console để ngăn cản người dùng xem kết quả thực thi câu lệnh trong console
  // Ví dụ: https://beta.nhaccuatui.com/
  // Hàm này sẽ tắt chức năng tự động clear console đó, giúp hacker dễ hack hơn :)
  disableAutoConsoleClear() {
    window.console.clear = () => null;
    console.log("Auto console.clear DISABLED!");
  }, // Hiển thị tất cả các biến toàn cục được tạo ra trong trang web
  // https://mmazzarolo.com/blog/2022-02-14-find-what-javascript-variables-are-leaking-into-the-global-scope/
  listGlobalVariables() {
    let browserGlobals = [];
    const ignoredGlobals = ["UfsGlobal"];

    function collectBrowserGlobals() {
      const iframe = window.document.createElement("iframe");
      iframe.src = "about:blank";
      window.document.body.appendChild(iframe);
      let globals = Object.keys(iframe.contentWindow);
      window.document.body.removeChild(iframe);
      return globals;
    }

    function getRuntimeGlobals() {
      if (browserGlobals.length === 0) {
        browserGlobals = collectBrowserGlobals();
      }
      const runtimeGlobals = Object.keys(window).filter(
        (key) => !ignoredGlobals.includes(key) && !browserGlobals.includes(key)
      );
      const runtimeGlobalsObj = {};
      runtimeGlobals.forEach((key, i) => {
        runtimeGlobalsObj[key] = window[key];
      });
      return runtimeGlobalsObj;
    }

    return getRuntimeGlobals();
  }, // https://mmazzarolo.com/blog/2022-07-30-checking-if-a-javascript-native-function-was-monkey-patched/
  // Kiểm tra xem function nào đó có bị override hay chưa
  isNativeFunction(f) {
    return f.toString().toString().includes("[native code]");
  }, // https://mmazzarolo.com/blog/2022-06-26-filling-local-storage-programmatically/
  // Làm đầy localStorage
  fillLocalStorage() {
    const key = "__filling_localstorage__";
    let max = 1;
    let data = "x";
    try {
      while (true) {
        data = data + data;
        localStorage.setItem(key, data);
        max <<= 1;
      }
    } catch {}
    for (let bit = max >> 1; bit > 0; bit >>= 1) {
      try {
        localStorage.setItem(key, data.substring(0, max | bit));
        max |= bit;
      } catch {
        console.success("Storage is now completely full 🍟");
      }
    }
    return function cleanup() {
      localStorage.removeItem(key);
      console.success("Storage is cleaned");
    };
  }, // https://mmazzarolo.com/blog/2022-02-16-track-down-the-javascript-code-responsible-for-polluting-the-global-scope/
  globalsDebugger(varName = "") {
    // https://stackoverflow.com/a/56933091/11898496
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("globalsToInspect", varName);
    window.location.search = urlParams.toString();
  }, // Tìm chuỗi xung quanh chuỗi bất kỳ
  // Ví dụ fullString = "abcd1234567890abcd" targetString = "6" bound = 3
  // => Kết quả around = 3456789
  getTextAround(fullString, targetString, bound = 10) {
    let curIndex = 0;
    let arounds = [];
    let limit = 100;

    while (limit) {
      let index = fullString.indexOf(targetString, curIndex);
      if (index === -1) break;

      let around = fullString.slice(
        Math.max(index - Math.floor(bound / 2) - 1, 0),
        Math.min(
          index + targetString.length + Math.floor(bound / 2),
          fullString.length
        )
      );
      arounds.push({ index, around });
      curIndex = index + (targetString.length || 1);
      limit--;
    }
    return arounds;
  }, // https://stackoverflow.com/a/40410744/11898496
  // Giải mã từ dạng 'http\\u00253A\\u00252F\\u00252Fexample.com' về 'http://example.com'
  decodeEscapedUnicodeString(str) {
    if (!str) return "";
    return decodeURIComponent(
      JSON.parse('"' + str.replace(/\"/g, '\\"') + '"')
    );
  }, // https://stackoverflow.com/a/8649003
  searchParamsToObject(search) {
    // let d = {};
    // decodeURI(search)
    //   .split("&")
    //   .map((_) => _.split("="))
    //   .forEach((_) => (d[_[0]] = _[1]));
    // return d;

    search = search || location.search.substring(1);
    return JSON.parse(
      '{"' + search.replace(/&/g, '","').replace(/=/g, '":"') + '"}',
      function (key, value) {
        return key === "" ? value : decodeURIComponent(value);
      }
    );
  },
  downloadData: UfsGlobal.Utils.downloadData,
};
UfsGlobal.largeImgSiteRules = [
  {
    // https://cdn.akamai.steamstatic.com/steam/apps/2357570/ss_d5acf4945c1f8db3b0bf048c08ba13fd04685ba0.600x338.jpg
    name: "steam static",
    src: /steamstatic\.com\/steam\/apps/,
    r: /(_|\.)\d{2,}x\d{2,}\./,
    s: ".",
  },
  {
    // https://images.pexels.com/users/avatars/822138648/th-vinh-flute-776.jpg?auto=compress&fit=crop&h=40&w=40&dpr=2
    name: "pexels",
    src: [/pexels\.com\/users\/avatars/, /images\.pexels\.com\/photos/],
    r: /\?.*/,
    s: "",
  },
  {
    // https://cdn.maze.guru/image/1F2B7646370A63B28C1F99B1E447C1C5.png?x-image-process=image/resize,w_400/quality,q_75/format,webp
    name: "maze.guru",
    src: /maze(\.|-)guru(.*?)\/image\//,
    r: /\?x-image-process.*/,
    s: "",
  },
  {
    // https://images-ng.pixai.art/images/orig/9ec30200-baaa-4cd0-8cc8-04002496adda
    name: "pixai",
    src: /pixai\.art\/images\//,
    r: /\/stillThumb\//,
    s: "/orig/",
  },
  {
    // https://yt3.googleusercontent.com/Qiekx-HxQTiX332zq-LyypoWshtuDptDQYab3zqqPVwkZ2AA1FgXveeb9Vi-7-b822g_e5hxmw=s160-c-k-c0x00ffffff-no-rj
    name: "googleusercontent",
    src: /\.googleusercontent\./i,
    r: /\=s\d+.*/i,
    s: "=s0",
  },
  {
    name: "gitlab",
    src: /gitlab\.(.*?)\/uploads\//i,
    r: /\?width=\d+/i,
    s: "",
  },
  {
    name: "font gstatic",
    src: /^https?:\/\/fonts\.gstatic\.com\/(.*)\/notoemoji/i,
    r: /(https?:\/\/.*)\/\d+.(png|jpg)/,
    s: "$1/512.$2",
  },
  {
    name: "artstation",
    url: /artstation\.com/,
    r: [
      /\/(avatars\/+\/)?medium\//i,
      /\/(\d{14}\/)?smaller_square\//i,
      /\/(\d{14}\/)?thumbnail\//i,
    ],
    s: "/large/",
  },
  {
    name: "123rf",
    url: /123rf\.com/,
    r: /us\.123rf\.com\/\d+wm\//i,
    s: "previews.123rf.com/images/",
  },
  {
    name: "wikipedia",
    url: /^https?:\/\/.+\.(wikipedia|wikimedia)\.org\//i,
    src: /^https?:\/\/.+\.wikimedia\.org\//i,
    r: /(https?:\/\/.*)\/thumb(\/.*)\/\d+px-.*/i,
    s: "$1$2",
  },
  {
    name: "trakt.tv",
    url: /^http:\/\/trakt\.tv\//i,
    example: "http://trakt.tv/shows",
    r: /(.*\/images\/posters\/\d+)-(?:300|138)\.jpg\?(\d+)$/i,
    s: "$1.jpg?$2",
  },
  {
    name: "Steampowered",
    url: /\.steampowered\.com/,
    r: /\.\d+x\d+\.jpg/i,
    s: ".jpg",
  },
  {
    name: "Steamcommunity",
    url: /steamcommunity\.com/,
    r: /output\-quality=\d+&fit=inside\|\d+\:\d+/i,
    s: "output-quality=100&fit=inside|0:0",
  },
  {
    name: "500px",
    url: /500px\./,
    r: [
      /\/w%3D\d+_h%3D\d+\/v2.*/i,
      /^((?:(?:pp?cdn|s\\d\\.amazonaws\\.com\/photos|gp\\d+\\.wac\\.edgecastcdn\\.net\/806614\/photos\/photos)\\.500px|djlhggipcyllo\\.cloudfront)\\.(?:net|org)\/\\d+\/[\\da-f]{40}\/)\\d+\\./,
    ],
    s: ["/m%3D2048_k%3D1_of%3D1/v2", "$12048.jpg"],
  },
  {
    name: "Nyaa",
    url: /nyaa\.se/,
    r: /upload\/small\//i,
    s: "upload/big/",
  },
  {
    name: "itunes",
    url: /itunes\.apple\.com/,
    r: /\d+x\d+bb\./i,
    s: "1400x1400bb.",
  },
  {
    name: "dribbble",
    url: /dribbble\.com/,
    r: [/_teaser(.[^\.]+)$/i, /_1x\./i, /\?compress=.*/],
    s: ["$1", ".", ""],
  },
  {
    name: "Tumblr",
    url: /tumblr\.com/,
    exclude: /\/avatar_/i,
    r: [
      /[^\/]*(media\.tumblr\.com.*_)\d+(\.[^\.]+)$/i,
      /(media\.tumblr\.com.*_)[^_]+(\.[^\.]+)$/i,
    ],
    s: ["$1raw$2", "$1512$2"],
  },
  // {
  //   name: "Tumblr",
  //   url: /tumblr\.com/,
  //   src: /\/avatar_/i,
  //   r: /(media\.tumblr\.com.*_)[^_]+(\.[^\.]+)$/i,
  //   s: "$1512$2",
  // },
  {
    name: "Pixiv",
    url: /pixiv\.net|pximg\.net/,
    src: /pximg\.net\/c\/\d+x\d+/i,
    r: /pximg\.net\/c\/\d+x\d+.*\/img\/(.*)_.*$/i,
    s: [
      "pximg.net/img-original/img/$1.jpg",
      "pximg.net/img-original/img/$1.png",
    ],
  },
  {
    name: "moegirl",
    url: /(moegirl|mengniang)\.org/,
    r: /(common)\/thumb(.*)\/[^\/]+/i,
    s: "$1$2",
  },
  {
    name: "fanfou",
    url: /fanfou\.com/,
    r: /@.+/i,
    s: "",
  },
  {
    name: "meitudata",
    url: /meipai\.com/,
    r: /!thumb.+/i,
    s: "",
  },
  {
    name: "mafengwo",
    url: /mafengwo\.cn/,
    r: /\?imageMogr.*/i,
    s: "",
  },
  {
    name: "discordapp",
    url: /(discordapp\.|discord\.)(com|net)/,
    r: /\?width=\d+&height=\d+$/i,
    s: "",
  },
  {
    name: "Fandom",
    url: /fandom\.com/,
    r: [/scale\-to\-width\-down\/\d+/i, /smart\/width\/\d+\/height\/\d+/i],
    s: ["", ""],
  },
  {
    name: "Zhisheji",
    url: /zhisheji\.com/,
    r: /thumbnail\/.*/i,
    s: "",
  },
  {
    name: "imgbox",
    src: /imgbox\.com/,
    r: /thumbs(\d\.imgbox.*)_t\./i,
    s: "images$1_o.",
  },
  {
    name: "Reddit",
    url: /reddit\.com|redd\.it/,
    r: /https?:\/\/preview\.redd.it\/([^\?]+)?.*/i,
    s: "https://i.redd.it/$1",
  },
  {
    name: "Rule34hentai",
    url: /rule34hentai\.net/,
    r: "/_thumbs/",
    s: "/_images/",
  },
  {
    name: "Rule34",
    url: /rule34\.xxx/,
    src: /\/(thumbnails|samples)\/(.*)\/(thumbnail|sample)_/i,
    r: /\/(thumbnails|samples)\/(.*)\/(thumbnail|sample)_(.*)\..*/i,
    s: ["/images/$2/$4.jpeg", "/images/$2/$4.png", "/images/$2/$4.jpg"],
  },
  {
    name: "Photosight",
    url: /photosight\.ru/,
    r: /(cdny\.de.*\/)t\//i,
    s: "$1x/",
  },
  {
    name: "588ku",
    url: /588ku\.com/,
    r: /!\/fw.*/,
    s: "",
  },
  {
    name: "gelbooru",
    url: /gelbooru\.com/,
    src: /(thumbnails|samples)\/(.*)\/(thumbnail|sample)_/i,
    r: /.*\/(thumbnails|samples)\/(.*)\/(thumbnail|sample)_(.*)\..*/i,
    s: [
      "https://img3.gelbooru.com/images/$2/$4.png",
      "https://img3.gelbooru.com/images/$2/$4.jpg",
      "https://img3.gelbooru.com/images/$2/$4.gif",
    ],
  },
  {
    name: "donmai",
    url: /donmai\.us/,
    src: /(thumbnails|sample)\/(.*)\/(thumbnail|sample)_|\/\d+x\d+\//i,
    r: [
      /\/(thumbnails|sample)\/(.*)\/(thumbnail|sample)_(.*)/i,
      /\/\d+x\d+\//i,
      /\/\d+x\d+\/(.*)\.(.*)/i,
    ], // TODO: array of r??
    s: [
      "/original/$2/$4",
      "/original/",
      ["/original/$1.jpg", "/original/$1.png", "/original/$1.gif"],
    ],
  },
  {
    name: "erosberry",
    url: /erosberry\.com/,
    r: /(\/\d+\/)tn_(\d+\.[^\/]+)$/i,
    s: "$1$2",
  },
  {
    name: "javdb",
    url: /javdb/,
    r: "/thumbs/",
    s: "/covers/",
  },
  {
    name: "javbus",
    url: /javbus\.|busjav\./,
    r: /\/thumbs?(\/\w+)\.jpg$/i,
    s: "/cover$1_b.jpg",
  },
  {
    name: "avmoo",
    url: /avmoo\./,
    r: "ps.jpg",
    s: "pl.jpg",
  },
  {
    name: "asiansister",
    url: /asiansister\.com/,
    r: "_t.",
    s: ".",
  },
  {
    name: "jianshu",
    url: /jianshu\.com/,
    r: /(upload-images\.jianshu\.io\/.*)\?.*/i,
    s: "$1",
  },
  {
    name: "wikiart",
    url: /wikiart\.org/,
    r: /!.*/i,
    s: "",
  },
  // {
  //   name: "discuz",
  //   r: [
  //     /(.+\/attachments?\/.+)\.thumb\.\w{2,5}$/i,
  //     /((wp-content|moecdn\.org)\/uploads\/.*)\-\d+x\d+(-c)?/i,
  //     /.*(?:url|src)=(https?:\/\/.*\.(?:jpg|jpeg|png|gif|bmp)).*/i,
  //     /.*thumb\.php\?src=([^&]*).*/i,
  //   ],
  //   s: "$1",
  // },
  {
    name: "weibo",
    url: /sinaimg/,
    r: [
      /(\.sinaimg\.(cn|com)\/)(?:bmiddle|orj360|mw\d+)/i,
      /(\.sinaimg\.(cn|com)\/)(?:square|thumbnail)/i,
      /(\.sinaimg\.(cn|com)\/\d+)\/50\//i,
      /k\.sinaimg\.cn\/n\/(.*)\/(w\d+)?h\d+[^\/]+$/,
      /thumb\d+/,
    ],
    s: ["$1large", "$1mw1024", "$1/180/", "n.sinaimg.cn/$1", "mw690"],
  },
  {
    name: "gravatar",
    src: /gravatar\.com\/avatar\/|\/gravatar\//i,
    r: /(avatar\/.*[\?&]s=)\d+(.*)/,
    s: "$19999$2",
  },
  {
    name: "ucServerAvatar",
    src: /uc_server\/avatar\.php/i,
    r: /(uc_server\/avatar\.php\?uid=\d+&size=).*/,
    s: "$1big",
  },
  {
    name: "md",
    src: /\.md\./i,
    r: /\.md(\.[^\.]+)$/i,
    s: "$1",
  },
  {
    name: "ytimg",
    src: /i\.ytimg\.com/i,
    exclude: /mqdefault_6s/i,
    r: /(.*?)(\w+)(\.\w+)(\?.+)?$/i,
    s: ["$1maxresdefault$3", "$1hqdefault$3"],
  },
  {
    name: "meituan",
    url: /\.meituan\.net/i,
    r: /\/avatar\/\w{2}/i,
    s: "/avatar/o0",
  },
  {
    name: "hdslb",
    src: /hdslb\.com\//i,
    r: /@.*/i,
    s: "",
  },
  {
    name: "coolapk",
    url: /\.coolapk\.com\//i,
    r: /\.s\.\w+$/i,
    s: "",
  },
  {
    name: "aicdn",
    src: /\.aicdn\.com\//i,
    r: /_fw\d+$/i,
    s: "",
  },
  {
    name: "duitang",
    url: /duitang\.com\//i,
    r: /.thumb.(\d+_)?\d*(_c)?\./i,
    s: ".",
  },
  {
    name: "imgur",
    src: /imgur\.com\//i,
    r: [/h(\.[^\/]+)$/i, /maxwidth=\d+/i],
    s: ["$1", "maxwidth=99999"],
  },
  {
    name: "dmm",
    src: /pics\.dmm\.co\.jp/i,
    r: "ps.jpg",
    s: "pl.jpg",
  },
  {
    name: "whd",
    src: /\/w\/\d+\/h\/\d+($|\/|\?)/i,
    r: /\/w\/\d+\/h\/\d+/i,
    s: "",
  },
  {
    name: "百度图片、贴吧等",
    src: /(hiphotos|imgsrc)\.baidu\.com/i,
    r: /(hiphotos|imgsrc)\.baidu\.com\/(.+?)\/.+?([0-9a-f]{40})/i,
    s: "$1.baidu.com/$2/pic/item/$3",
  },
  {
    name: "pixiv",
    src: /pixiv\.net/i,
    r: /(pixiv.net\/img\d+\/img\/.+\/\d+)_[ms]\.(\w{2,5})$/i,
    s: "$1.$2",
  },
  {
    name: "taobaocdn",
    src: /(taobaocdn|alicdn)\.com/i,
    r: [
      /.*((?:img\d\d\.taobaocdn|img(?:[^.]*\.?){1,2}?\.alicdn)\.com\/)(?:img\/|tps\/http:\/\/img\d\d+\.taobaocdn\.com\/)?((?:imgextra|bao\/uploaded)\/.+\.(?:jpe?g|png|gif|bmp))_.+\.jpg$/i,
      /(.*\.alicdn\.com\/.*?)((.jpg|.png)(\.|_)\d+x\d+.*)\.jpg(_\.webp)?$/i,
      /(.*\.alicdn\.com\/.*?)((\.|_)\d+x\d+.*|\.search|\.summ)\.jpg(_\.webp)?$/i,
    ],
    s: ["http://$1$2", "$1$3", "$1.jpg"],
  },
  {
    name: "yihaodianimg",
    url: /yhd\.com/i,
    src: /yihaodianimg\.com/i,
    r: /(.*\.yihaodianimg\.com\/.*)_\d+x\d+\.jpg$/i,
    s: "$1.jpg",
  },
  {
    name: "jd",
    url: /jd\.com/i,
    src: /360buyimg\.com/i,
    r: [
      /(.*360buyimg\.com\/)n\d\/.+?\_(.*)/i,
      /(.*360buyimg\.com\/)n\d\/(.*)/i,
      /(.*360buyimg\.com\/.*)s\d+x\d+_(.*)/i,
    ],
    s: ["$1imgzone/$2", "$1n0/$2", "$1$2"],
  },
  {
    name: "dangdang",
    url: /dangdang\.com/i,
    src: /ddimg\.cn/i,
    r: /(.*ddimg.cn\/.*?)_[bw]_(\d+\.jpg$)/i,
    s: "$1_e_$2",
  },
  {
    name: "duokan",
    url: /duokan\.com/i,
    r: /(cover.read.duokan.com.*?\.jpg)!\w+$/i,
    s: "$1",
  },
  {
    name: "yyets",
    url: /yyets\.com/i,
    r: /^(res\.yyets\.com.*?\/ftp\/(?:attachment\/)?\d+\/\d+)\/[ms]_(.*)/i,
    s: "http://$1/$2",
  },
  {
    name: "mozilla",
    url: /addons\.mozilla\.org/i,
    r: "addons.cdn.mozilla.net/user-media/previews/thumbs/",
    s: "/thumbs/full/",
  },
  {
    name: "firefox",
    url: /firefox\.net\.cn/i,
    r: "www.firefox.net.cn/attachment/thumb/",
    s: "www.firefox.net.cn/attachment/",
  },
  {
    name: "crsky",
    url: /\.crsky\.com/i,
    r: /pic\.crsky\.com.*_s\.gif$/i,
    s: "/_s././",
    example: "http://www.crsky.com/soft/5357.html",
  },
  {
    name: "zol",
    url: /\.zol\.com/i,
    r: /(\w+\.zol-img\.com\.cn\/product\/\d+)_\d+x\d+\/(.*\.jpg)/i,
    s: "$1/$2",
    example: "http://detail.zol.com.cn/240/239857/pic.shtml",
  },
  {
    name: "yesky",
    url: /\.yesky\.com/i,
    r: /_\d+x\d+\.([a-z]+)$/i,
    s: ".$1",
    example: "http://game.yesky.com/tupian/165/37968665.shtml",
  },
  {
    name: "巴哈姆特",
    url: /^https:\/\/\w+\.gamer\.com\.tw/,
    src: /bahamut\.com\.tw/,
    r: "/S/",
    s: "/B/",
  },
  {
    name: "sgamer",
    url: /\.sgamer\.com/i,
    r: /\/s([^\.\/]+\.[a-z]+$)/i,
    s: "/$1",
    example: "http://dota2.sgamer.com/albums/201407/8263_330866.html",
  },
  {
    name: "nhentai",
    url: /nhentai\.net/i,
    r: /\/\/\w+(\..*\/)(\d+)t(\.[a-z]+)$/i,
    s: "//i$1$2$3",
    example: "http://nhentai.net/g/113475/",
  },
  {
    name: "GithubAvatars",
    url: /github\.com/i,
    r: /(avatars\d*\.githubusercontent\.com.*)\?.*$/i,
    s: "$1",
    example: "https://avatars2.githubusercontent.com/u/3233275/",
  },
  {
    name: "ggpht",
    src: /ggpht\.com/i,
    r: /=s\d+.*/i,
    s: "=s0",
  },
  {
    name: "kodansha",
    url: /kodansha\.co\.jp/i,
    src: /kodansha\.co\.jp/i,
    r: "t_og_image_center",
    s: "c_limit",
  },
  {
    name: "fanseven",
    url: /fanseven\.com/i,
    src: /fanseven\.com/i,
    r: /w=\d+&h=\d+/i,
    s: "w=9999&h=9999",
  },
  {
    name: "hentai-cosplays",
    url: /^https:\/\/(.*\.)?(hentai\-cosplays|porn\-images\-xxx)\.com/,
    r: /\/p=[\dx]+(\/\d+\.\w+)$/i,
    s: "$1",
  },
  {
    name: "imdb",
    url: /^https?:\/\/www\.imdb\.com/,
    src: /media\-amazon/,
    r: /@.*(\.\w)/i,
    s: "@$1",
  },
  {
    name: "雪球",
    url: /^https?:\/\/xueqiu\.com\//,
    src: /^https?:\/\/xqimg\.imedao\.com\//i,
    r: /!\d+(x\d+[a-z]?)?\.\w+$/,
    s: "",
  },
  {
    name: "小众论坛",
    url: /^https?:\/\/meta\.appinn\.net/,
    src: /meta\-cdn/,
    r: /\/optimized\/(.*)_\d+_\d+x\d+(\.\w+)$/,
    s: "/original/$1$2",
  },
  {
    name: "诱惑福利图",
    url: /www\.yhflt\.com/,
    src: /imgs\.yhflt\.com/,
    r: /imgs(\..*\/)q/,
    s: "pic$1",
  },
  {
    name: "blogger",
    src: /blogger\.googleusercontent\.com\/img/,
    r: /\/[sw]\d+\/.*/,
    s: "/s0",
  },
  {
    name: "煎蛋",
    url: /^https:\/\/jandan\.net\//,
    r: [/\/(thumb\d+|mw\d+)\//, /!square/],
    s: ["/large/", ""],
  },
  {
    name: "辉夜白兔",
    url: /47\.101\.137\.235/,
    r: "thumb",
    s: "regular",
  },
  {
    name: "Civitai",
    url: /^https:\/\/civitai\.com\//,
    r: /\/width=\d+\//,
    s: "/",
  },
];

if (window) window.UfsGlobal = UfsGlobal;

// export if posible
if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
  module.exports = UfsGlobal;
}

console.log("UfsGlobal loaded");
