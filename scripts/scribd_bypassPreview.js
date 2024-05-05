export default {
  icon: "https://s-f.scribdassets.com/scribd.ico?014e86d16?v=5",
  name: {
    en: "Scribd - bypass preview",
    vi: "Scribd - Xem miễn phí VIP",
  },
  description: {
    en: "View VIP document on Scribd.com, bypass preview popup / reveal blurred content.",
    vi: "Xem tài liệu VIP trên Scribd.com, loại bỏ popup chặn xem trước, loại bỏ hiệu ứng làm mờ.",
  },
  blackList: [],
  whiteList: ["https://www.scribd.com/*"],

  pageScript: {
    onDocumentIdle: () => {
      UfsGlobal.Extension.getURL("scripts/scribd_bypassPreview.css").then(
        UfsGlobal.DOM.injectCssFile
      );

      function ufs_scribd_bypass_preview() {
        [...document.querySelectorAll(".blurred_page .newpage *")].forEach(
          (el) => {
            if (el.style.color === "transparent") {
              el.style.color = "black";
            }
          }
        );
        [...document.querySelectorAll(".blurred_page")].forEach((el) => {
          el.classList.remove("blurred_page");
        });
      }

      ufs_scribd_bypass_preview();
      setInterval(ufs_scribd_bypass_preview, 3000);
    },
  },
};
