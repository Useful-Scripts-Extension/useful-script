export default {
  icon: "https://www.scribd.com/favicon.ico",
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

  onDocumentIdle: () => {
    UsefulScriptGlobalPageContext.Extension.getURL(
      "scripts/scribd_bypassPreview.css"
    ).then(UsefulScriptGlobalPageContext.DOM.injectCssFile);

    function ufs_bypass_preview() {
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

    ufs_bypass_preview();
    setInterval(ufs_bypass_preview, 3000);
  },
};
