import { UfsGlobal } from "./content-scripts/ufs_global.js";

export default {
  icon: '<i class="fa-solid fa-virus fa-lg"></i>',
  name: {
    en: "Inject script to website",
    vi: "Nhúng script vào trang web",
  },
  description: {
    en: "Inject script url to current website, eg. jquery, library, etc.",
    vi: "Nhúng link script vào website, ví dụ nhúng jquery, thư viện js, ...",
  },

  pageScript: {
    onClick: function () {
      let url = prompt(
        "Enter script url / Nhập link script: ",
        "//code.jquery.com/jquery-3.6.1.min.js"
      );

      if (url) {
        UfsGlobal.DOM.injectScriptSrc(url, (success, error) => {
          if (success) {
            alert("Inject SUCCESS.\n\n" + url);
          } else {
            alert("Inject FAILED.\n\n" + JSON.stringify(error));
          }
        });
      }
    },
  },
};

function backup() {
  // https://stackoverflow.com/a/38840724/11898496
  // Script loader: https://plnkr.co/edit/b9O19f?p=preview&preview
}
