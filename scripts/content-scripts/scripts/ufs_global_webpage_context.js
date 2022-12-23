// Tất cả các hàm/biến toàn cục được nhúng vào trang web at document_start
// Có thể truy cập từ các script chạy trong webpage context (có hàm onClick)

const UsefulScriptGlobalPageContext = {
  Extension: {
    sendToContentScript: function (event, data) {
      return new Promise((resolve, reject) => {
        let listenerKey = "ufs-contentscript-sendto-pagescript";
        let listener = (evt) => {
          if (evt.detail.event === event) {
            resolve(evt.detail.data);
            window.removeEventListener(listenerKey, listener);
          }
        };
        window.addEventListener(listenerKey, listener);
        window.dispatchEvent(
          new CustomEvent("ufs-pagescript-sendto-contentscript", {
            detail: { event, data },
          })
        );
      });
    },
    getURL: async function (filePath) {
      return await UsefulScriptGlobalPageContext.Extension.sendToContentScript(
        "getURL",
        filePath
      );
    },
  },
  DOM: {
    // https://stackoverflow.com/a/3381522
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
      UsefulScriptGlobalPageContext.onElementsVisible(
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
        UsefulScriptGlobalPageContext.onElementsVisible(
          selector,
          resolve,
          false
        );
      });
    },

    // Idea from  https://github.com/gys-dev/Unlimited-Stdphim
    // https://stackoverflow.com/a/61511955/11898496
    onElementsVisible: async (selector, callback, willReRun) => {
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
      document.head.appendChild(css);
    },

    injectCssFile(filePath) {
      var css = document.createElement("link");
      css.setAttribute("rel", "stylesheet");
      css.setAttribute("type", "text/css");
      css.setAttribute("href", filePath);
      document.head.appendChild(css);
    },
  },
  Facebook: {
    getUserAvatarFromUid(uid) {
      return (
        "https://graph.facebook.com/" +
        uid +
        "/picture?height=500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662"
      );
    },
    getUserProfileDataFromUid: async (uid) => {
      const variables = {
        userID: uid,
        shouldDeferProfilePic: false,
        useVNextHeader: false,
        scale: 1.5,
      };
      let f = new URLSearchParams();
      f.append("fb_dtsg", require("DTSGInitialData").token);
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
        name: UsefulScriptsUtils.decodeEscapedUnicodeString(
          /"name":"(.*?)"/.exec(text)?.[1]
        ),
        profiePicLarge: UsefulScriptsUtils.decodeEscapedUnicodeString(
          /"profilePicLarge":{"uri":"(.*?)"/.exec(text)?.[1]
        ),
        //  profiePicMedium: /"profilePicMedium":{"uri":"(.*?)"/.exec(text)?.[1],
        //  profiePicSmall: /"profilePicSmall":{"uri":"(.*?)"/.exec(text)?.[1],
        //  profilePic160: /"profilePic160":{"uri":"(.*?)"/.exec(text)?.[1],
        gender: /"gender":"(.*?)"/.exec(text)?.[1],
        alternateName: /"alternate_name":"(.*?)"/.exec(text)?.[1],
      };
    },
    decodeArrId(arrId) {
      return arrId[0] * 4294967296 + arrId[1];
    },
  },
};
window.UsefulScriptGlobalPageContext = UsefulScriptGlobalPageContext;

// Chứa các hàm hỗ trợ việc hack web :))
const UsefulScriptsUtils = {
  // Có trang web tự động xoá console để ngăn cản người dùng xem kết quả thực thi câu lệnh trong console
  // Ví dụ: https://beta.nhaccuatui.com/
  // Hàm này sẽ tắt chức năng tự động clear console đó, giúp hacker dễ hack hơn :)
  disableAutoConsoleClear() {
    window.console.clear = () => null;
    console.log("Auto console.clear DISABLED!");
  },

  // Hiển thị tất cả các biến toàn cục được tạo ra trong trang web
  // https://mmazzarolo.com/blog/2022-02-14-find-what-javascript-variables-are-leaking-into-the-global-scope/
  listGlobalVariables() {
    let browserGlobals = [];
    const ignoredGlobals = ["UsefulScriptsUtils"];

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
  },

  // https://mmazzarolo.com/blog/2022-07-30-checking-if-a-javascript-native-function-was-monkey-patched/
  // Kiểm tra xem function nào đó có bị override hay chưa
  isNativeFunction(f) {
    return f.toString().toString().includes("[native code]");
  },

  // https://mmazzarolo.com/blog/2022-06-26-filling-local-storage-programmatically/
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
  },

  // https://mmazzarolo.com/blog/2022-02-16-track-down-the-javascript-code-responsible-for-polluting-the-global-scope/
  globalsDebugger(varName = "") {
    // https://stackoverflow.com/a/56933091/11898496
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("globalsToInspect", varName);
    window.location.search = urlParams.toString();
  },

  // Tìm chuỗi xung quanh chuỗi bất kỳ
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
  },

  // https://stackoverflow.com/a/40410744/11898496
  // Giải mã từ dạng 'http\\u00253A\\u00252F\\u00252Fexample.com' về 'http://example.com'
  decodeEscapedUnicodeString(str) {
    if (!str) return "";
    return decodeURIComponent(
      JSON.parse('"' + str.replace(/\"/g, '\\"') + '"')
    );
  },

  // https://stackoverflow.com/a/8649003
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
};
window.UsefulScriptsUtils = UsefulScriptsUtils;

// ================================= Polyfill =================================
// Chrome pre-34
if (!Element.prototype.matches)
  Element.prototype.matches = Element.prototype.webkitMatchesSelector;

// https://mmazzarolo.com/blog/2022-08-25-simple-colored-logging-for-javascript-clis/
window.console.success = (...args) => console.log("\x1b[32m✔\x1b[0m", ...args);
window.console.failure = (...args) =>
  console.error("\x1b[31mｘ\x1b[0m", ...args);
