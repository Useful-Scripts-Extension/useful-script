export default {
  icon: `<i class="fa-regular fa-copy fa-lg"></i>`,
  name: {
    en: "Enable/Disable allow copy",
    vi: "Bật/Tắt cho phép sao chép",
  },
  description: {
    en: "Allow Copy on every websites",
    vi: "Cho phép sao chép trong mọi website",
  },

  contentScript: {
    onDocumentStart: function () {
      // https://chrome.google.com/webstore/detail/simple-allow-copy/aefehdhdciieocakfobpaaolhipkcpgc
      window.unlocker = (() => {
        // a raw script to be into page,
        // because content_script's access to BOM is restricted by Chrome
        // see: https://developer.chrome.com/extensions/content_scripts#isolated_world
        function agent() {
          let unlock = false;
          document.addEventListener("allow_copy", (event) => {
            unlock = event.detail.unlock;
          });
          const copyEvents = [
            "copy",
            "cut",
            "contextmenu",
            "selectstart",
            "mousedown",
            "mouseup",
            "mousemove",
            "keydown",
            "keypress",
            "keyup",
          ];
          const rejectOtherHandlers = (e) => {
            if (unlock) {
              e.stopPropagation();
              if (e.stopImmediatePropagation) e.stopImmediatePropagation();
            }
          };
          copyEvents.forEach((evt) => {
            document.documentElement.addEventListener(
              evt,
              rejectOtherHandlers,
              {
                capture: true,
              }
            );
          });
        }
        const logger = {
          log(...args) {
            return console.log(...args);
          },
          error(...args) {
            return console.error(...args);
          },
        };

        const JS_ELEM_ID = "allow-copy_script";
        const injectAgent = (wnd = window.top) => {
          try {
            const doc = wnd.document;
            if (!doc.getElementById(JS_ELEM_ID)) {
              const script = doc.createElement("SCRIPT");
              script.id = JS_ELEM_ID;
              script.textContent = `(${agent})()`;
              doc.documentElement.append(script);
            }
          } catch (error) {
            logger.error("[simple allow copy] cannot inject agent", error);
          }
        };
        const enableAgent = (wnd = window.top) => {
          try {
            const event = new CustomEvent("allow_copy", {
              detail: {
                unlock: true,
              },
            });
            wnd.document.dispatchEvent(event);
          } catch (error) {
            logger.error("[simple allow copy] cannot enable agent", error);
          }
        };
        const disableAgent = (wnd = window.top) => {
          try {
            const event = new CustomEvent("allow_copy", {
              detail: {
                unlock: false,
              },
            });
            wnd.document.dispatchEvent(event);
          } catch (error) {
            logger.error("[simple allow copy] cannot disable agent", error);
          }
        };
        const CSS_ELEM_ID = "allow-copy_style";
        const addCss = (wnd = window.top) => {
          try {
            const doc = wnd.document;
            removeCss(wnd);
            const style = doc.createElement("STYLE");
            style.id = CSS_ELEM_ID;
            style.innerHTML =
              `html, body, *, *::before, *::after, html body *, #${JS_ELEM_ID} ~ body * {\n` +
              "  -webkit-user-select: initial !important; \n" +
              "  user-select: initial !important; \n" +
              "} ";
            doc.documentElement.append(style);
          } catch (error) {
            logger.error("[simple allow copy] cannot add css", error);
          }
        };
        const removeCss = (wnd = window.top) => {
          try {
            const style = wnd.document.getElementById(CSS_ELEM_ID);
            if (style) {
              style.remove();
            }
          } catch (error) {
            logger.error("[simple allow copy] cannot remove css", error);
          }
        };
        const getFrameWindows = (wnd = window) => {
          try {
            const doc = wnd.document;
            const iframes = [].slice.apply(doc.getElementsByTagName("iframe"));
            return [].concat(
              wnd,
              ...iframes
                .map((iframe) => iframe.contentWindow)
                .map((childWnd) => getFrameWindows(childWnd))
            );
          } catch (error) {
            logger.error("[simple allow copy] cannot get frame window", error);
            return [wnd];
          }
        };
        let windows = [];
        let isEnabled = false;
        const enable = () => {
          isEnabled = true;
          windows.forEach((wnd) => {
            enableAgent(wnd);
            addCss(wnd);
          });
        };
        const disable = () => {
          isEnabled = false;
          windows.forEach((wnd) => {
            disableAgent(wnd);
            removeCss(wnd);
          });
        };
        if (isEnabled) {
          enable();
        } else {
          disable();
        }
        const initForFrames = () => {
          // windows = getFrameWindows();
          // logger.log("windows ", windows);
          // windows.forEach((wnd) => injectAgent(wnd));
          injectAgent(window);
          if (isEnabled) {
            enable();
          } else {
            disable();
          }
        };

        // init
        initForFrames();
        [1000, 3000, 5000, 10000].forEach((delay) => {
          setTimeout(initForFrames, delay);
        });

        return {
          enable,
          disable,
          enabled: () => isEnabled,
        };
      })();
    },
    runInAllFrames: true,

    onClick: function () {
      if (!window.unlocker) {
        alert("Vui lòng mở chức năng trước, rồi tải lại trang web.");
      } else if (window.unlocker.enabled()) {
        window.unlocker.disable();
        alert("Đã TẮT cho phép sao chép.\nSimple allow copy DISABLED.");
      } else {
        window.unlocker.enable();
        alert("Đã BẬT cho phép sao chép.\nSimple allow copy ENABLED.");
      }
    },
  },
};
