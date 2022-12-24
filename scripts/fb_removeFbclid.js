export default {
  icon: '<i class="fa-solid fa-link-slash fa-lg"></i>',
  name: {
    en: "Auto remove Fbclid from link",
    vi: "Tự động xóa Fbclid từ liên kết",
  },
  description: {
    en: "Auto remove Facebook click identifier (Fbclid) parameter from links",
    vi: "Tự động xóa địa chỉ theo dõi của facebook (Fbclid) từ liên kết",
  },
  infoLink: "https://viblo.asia/p/lo-hong-clickjacking-aWj536e1l6m",
  whiteList: ["http://*/*", "https://*/*"],

  onDocumentStart: () => {
    // Source code copy from J2team security

    "use strict";
    !(function (e, c) {
      var o = new URL(e.top.location.href);
      o.searchParams.has("fbclid") &&
        (o.searchParams["delete"]("fbclid"), alert('abc'), e.top.location.replace(o));
    })(window, chrome);
  },
};
