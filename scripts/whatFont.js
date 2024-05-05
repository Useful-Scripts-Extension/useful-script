export default {
  icon: `https://www.typewolf.com/favicon.ico`,
  name: {
    en: "What font",
    vi: "Kiểm tra font chữ",
  },
  description: {
    en: "Check font used in webpage",
    vi: "Kiểm tra xem từng phần tử trong web dùng font chữ gì",
  },

  pageScript: {
    onClick: function () {
      // https://www.typewolf.com/type-sample

      UfsGlobal.DOM.injectScriptSrc(
        "https://www.typesample.com/assets/typesample.js?r=" +
          Math.random() * 99999999,
        (success, fail) => {
          if (success) {
            alert("Script loaded, now use can use WhatFont.");
          } else {
            alert("Inject failed, Cannot run script in this website");
          }
        }
      );
    },
  },
};
