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
  blackList: [],
  whiteList: ["https://www.studocu.com/*/document/*"],

  onDocumentIdle: () => {
    let style = document.createElement("style");
    style.textContent = `
    .page-content {
        filter: none !important;
    }
    ._de9e5fdb76af,
    ._869f7c361ca9,
    span.l {
        display: none !important;
    }`;
    document.body.appendChild(style);
  },
};
