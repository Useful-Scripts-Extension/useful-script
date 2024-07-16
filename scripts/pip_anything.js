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
      const openInPip = async (element) => {
        const pipWindow = await documentPictureInPicture.requestWindow();
        copyStyleSheets(pipWindow);
        replaceWithPlaceHolder(element);
        pipWindow.document.body.append(element);
        pipWindow.addEventListener("pagehide", restorePIPElement);
      };

      UfsGlobal.DOM.pickElement().then((element) => {
        openInPip(element);
      });
    },
  },
};
