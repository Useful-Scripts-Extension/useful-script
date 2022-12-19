export default {
  icon: "https://d20ohkaloyme4g.cloudfront.net/img/favicon.ico",
  name: {
    en: "Studocu - Bypass preview",
    vi: "Studocu - Xem miễn phí VIP",
  },
  description: {
    en: "View VIP document on Studocu.com, bypass preview popup / reveal blurred content.",
    vi: "Xem tài liệu VIP trên Studocu.com, loại bỏ popup chặn xem trước, loại bỏ hiệu ứng làm mờ.",
  },
  onDocumentIdle: () => {
    UsefulScriptGlobalPageContext.DOM.injectCssFile(
      UsefulScriptGlobalPageContext.Extension.getURL(
        "scripts/studocu_bypassPreview.css"
      )
    );
  },
};
