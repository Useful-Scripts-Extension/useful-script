import { UfsGlobal } from "./content-scripts/ufs_global.js";

export default {
  icon: `<i class="fa-regular fa-copy fa-lg"></i>`,
  name: {
    en: "Enable/Disable allow copy",
    vi: "Bật/Tắt cho phép sao chép",
  },
  description: {
    en: `Allow Copy on every websites<br/>
    <p style="color:yellow">NOTES:</p>
    <ul>
      <li>Need to enable autorun first</li>
      <li>Click this button to TURN ON cheat to allow copy/right-click for current website.</li>
      <li>Click again to TURN OFF.</li>
    </ul>`,
    vi: `Cho phép sao chép trong mọi trang web<br/>
    <p style="color:yellow">CHÚ Ý:</p>
    <ul>
      <li>Cần bật tự động chạy trước</li>
      <li>Khi vào trang web muốn copy/chuột phải, click 1 lần chức năng để BẬT.</li>
      <li>Khi copy/chuột phải xong có thể click lần nữa để TẮT.</li>
    </ul>`,
  },

  contentScript: {
    onDocumentStart_: function () {
      unlocker.init();
      window.ufs_simpleAllowCopy = true;
    },

    onClick_: function () {
      let isMainFrame = !UfsGlobal.DOM.isInIframe();
      if (!window.ufs_simpleAllowCopy) {
        if (isMainFrame)
          alert("Vui lòng mở chức năng trước, rồi tải lại trang web.");
      } else if (unlocker.enabled()) {
        unlocker.disable();
        if (isMainFrame)
          alert("Đã TẮT cho phép sao chép.\nSimple allow copy DISABLED.");
      } else {
        unlocker.enable();
        if (isMainFrame)
          alert("Đã BẬT cho phép sao chép.\nSimple allow copy ENABLED.");
      }
    },
  },
};

// modified from https://chrome.google.com/webstore/detail/simple-allow-copy/aefehdhdciieocakfobpaaolhipkcpgc
const unlocker = (() => {
  const logger = {
    log(...args) {
      return console.log(...args);
    },
    error(...args) {
      return console.error(...args);
    },
  };

  let enabled = false;
  let inited = false;
  function init() {
    if (inited) return;
    inited = true;

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
      if (enabled) {
        e.stopPropagation();
        if (e.stopImmediatePropagation) e.stopImmediatePropagation();
      }
    };
    copyEvents.forEach((evt) => {
      document.documentElement.addEventListener(evt, rejectOtherHandlers, {
        capture: true,
      });
    });
  }

  const CSS_ELEM_ID = "allow-copy_style";
  const addCss = () => {
    try {
      const doc = window.document;
      removeCss(wnd);
      const style = doc.createElement("STYLE");
      style.id = CSS_ELEM_ID;
      style.innerHTML =
        `html, body, *, *::before, *::after, html body * {\n` +
        "  -webkit-user-select: initial !important; \n" +
        "  user-select: initial !important; \n" +
        "} ";
      doc.documentElement.append(style);
    } catch (error) {
      logger.error("[simple allow copy] cannot add css", error);
    }
  };
  const removeCss = () => {
    try {
      const style = window.document.getElementById(CSS_ELEM_ID);
      if (style) {
        style.remove();
      }
    } catch (error) {
      logger.error("[simple allow copy] cannot remove css", error);
    }
  };

  const enable = () => {
    enabled = true;
    addCss();
  };
  const disable = () => {
    enabled = false;
    removeCss();
  };

  return {
    init,
    enable,
    disable,
    enabled: () => enabled,
  };
})();
