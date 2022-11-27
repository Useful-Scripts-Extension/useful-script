export default {
  icon: '<i class="fa-solid fa-virus"></i>',
  name: {
    en: "Inject script to website",
    vi: "Nhúng script vào trang web",
  },
  description: {
    en: "",
    vi: "",
  },
  blackList: [],
  whiteList: [],

  func: function () {
    // https://stackoverflow.com/a/26573284
    function injectScriptAndUse(src) {
      var script = document.createElement("script");
      script.src = src;
      script.onload = function () {
        alert("Inject SUCCESS: " + url);
      };
      script.onerror = function (e) {
        alert("Inject FAILED. " + e);
      };
      document.querySelector("head")?.appendChild?.(script);
    }

    // https://stackoverflow.com/a/43467144
    function isValidHttpUrl(string) {
      let url;
      try {
        url = new URL(string);
      } catch (_) {
        return false;
      }
      return url.protocol === "http:" || url.protocol === "https:";
    }

    let url = prompt(
      "Enter script url / Nhập link script: ",
      "//code.jquery.com/jquery-3.6.1.min.js"
    );

    if (url) {
      //   if (!isValidHttpUrl(url)) alert("URL not valid / Link không hợp lệ");
      //   else {
      injectScriptAndUse(url);
      //   }
    }
  },
};
