import { UfsGlobal } from "./content-scripts/ufs_global.js";

export default {
  icon: '<i class="fa-regular fa-object-group fa-lg"></i>',
  name: {
    en: "PIP anything",
    vi: "PIP mọi thứ",
  },
  description: {
    en: "Picture in picture mode for anything, not just video, choose website content to show in PIP mode",
    vi: "Xem bất kỳ giao diện nào trong cửa sổ nổi (Picture in picture), không chỉ mỗi video, click chọn phần tử từ website để xem trong cửa sổ nổi.",
    img: "",
  },

  changeLogs: {
    date: "description",
  },

  popupScript: {
    onClick: () => {
      window.close();
    },
  },

  contentScript: {
    // original from https://chromewebstore.google.com/detail/gepffghbolhjojibgohkdecdibdpbali
    // document: https://developer.chrome.com/docs/web-platform/document-picture-in-picture
    onClick: () => {
      pickElement().then((element) => {
        openInPip(element);
      });
    },
  },
};

const copyStyleSheets = (pipWindow) => {
  [...document.styleSheets].forEach((styleSheet) => {
    try {
      const cssRules = [...styleSheet.cssRules]
        .map((rule) => rule.cssText)
        .join("");
      const style = document.createElement("style");
      style.textContent = cssRules;
      pipWindow.document.head.appendChild(style);
    } catch (e) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.type = styleSheet.type;
      link.media = styleSheet.media;
      link.href = styleSheet.href;
      pipWindow.document.head.appendChild(link);
    }
  });
};
const replaceWithPlaceHolder = (element) => {
  const placeHolder = document.createElement("div");
  placeHolder.id = "PIPPlaceHolder";
  placeHolder.style.display = "none";
  element.replaceWith(placeHolder);
};
const restorePIPElement = (event) => {
  const pipElement = event.target.body.firstChild;
  const placeHolder = document.querySelector("#PIPPlaceHolder");
  placeHolder.replaceWith(pipElement);
};
export const openInPip = async (element) => {
  const pipWindow = await documentPictureInPicture.requestWindow();
  copyStyleSheets(pipWindow);
  replaceWithPlaceHolder(element);
  pipWindow.document.body.append(element);
  pipWindow.addEventListener("pagehide", restorePIPElement);
};

function pickElement() {
  return new Promise((resolve) => {
    // #region init elements
    const host = document.createElement("div");
    const shadow = host.attachShadow({ mode: "closed" });

    const style = document.createElement("style");
    style.textContent = /*css*/ `
      :host {
        position: fixed;
        display: block;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 99999999;
        pointer-events: none;
      }
      #highlighter {
        position: absolute;
        top: 0;
        left: 0;
        width: 0;
        height: 0;
        background: #ff3f3f22;
        border: 1px solid #F00;
        box-shadow: 0 0 0 99999px rgba(0, 0, 0, .5);
      }
      #confirmer {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 200px;
        height: 200px;
      }
      #confirmer input {
        width: 100%;
      }
    `;
    shadow.append(style);

    const highlighter = document.createElement("div");
    highlighter.id = "highlighter";
    shadow.append(highlighter);

    // const confirmer = document.createElement("div");
    // confirmer.id = "confirmer";
    // confirmer.innerHTML = `
    //   <input type="range"></input>
    //   <butotn>Pick</button>
    //   <button>Confirm</button>
    // `;
    // shadow.append(confirmer);

    document.documentElement.append(host);
    // #endregion

    // #region pick element
    const STATES = {
      picking: "picking",
      confirming: "confirming",
    };
    let state = STATES.picking;
    let currentTarget = null;
    function onMouseOver(e) {
      e.preventDefault();
      const target = e.target;
      if (state !== STATES.picking || !target || target === highlighter) return;

      highlightElement(target);
    }

    function highlightElement(elem) {
      const rect = getElementBoundingClientRect(elem);
      highlighter.style.cssText = `
        top: ${rect.top}px;
        left: ${rect.left}px;
        width: ${rect.width}px;
        height: ${rect.height}px;
      `;
      currentTarget = elem;
    }

    window.addEventListener("mouseover", onMouseOver, { capture: true });
    window.addEventListener(
      "click",
      (e) => {
        e.preventDefault();
        // confirmPick(currentTarget);

        host.remove();
        resolve(currentTarget);
        window.removeEventListener("mouseover", onMouseOver);
      },
      { once: true, capture: true }
    );
    // #endregion
  });
}

function getElementBoundingClientRect(elem) {
  let rect =
    typeof elem.getBoundingClientRect === "function"
      ? elem.getBoundingClientRect()
      : { height: 0, left: 0, top: 0, width: 0 };

  // https://github.com/gorhill/uBlock/issues/1024
  // Try not returning an empty bounding rect.
  if (rect.width !== 0 && rect.height !== 0) return rect;
  if (elem.shadowRoot instanceof DocumentFragment)
    return getElementBoundingClientRect(elem.shadowRoot);

  let left = rect.left,
    right = left + rect.width,
    top = rect.top,
    bottom = top + rect.height;

  for (const child of elem.children) {
    rect = getElementBoundingClientRect(child);
    if (rect.width === 0 || rect.height === 0) continue;
    if (rect.left < left) left = rect.left;
    if (rect.right > right) right = rect.right;
    if (rect.top < top) top = rect.top;
    if (rect.bottom > bottom) bottom = rect.bottom;
  }

  let height = bottom - top,
    width = right - left;

  return { bottom, height, left, right, top, width };
}
