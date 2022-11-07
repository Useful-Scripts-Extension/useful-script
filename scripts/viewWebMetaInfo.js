export default {
  icon: "",
  name: {
    en: "See web meta info (SEO)",
    vi: "Xem thông tin meta của web (SEO)",
  },
  description: {
    en: "Instantly shows meta information about the current site in an on-page iFrame.",
    vi: "Xem thông tin meta của website trực tiếp trong trang web",
  },
  blackList: [],
  whiteList: [],

  func: function () {
    // source code from: https://bookmarklet.vercel.app/

    if (window.ouiseo === undefined) {
      var jsCode = document.createElement("script");
      jsCode.setAttribute(
        "src",
        "//carlsednaoui.s3.amazonaws.com/ouiseo/ouiseo.min.js"
      );
      document.body.appendChild(jsCode);
    } else if (!!window.ouiseo && !document.getElementById("ouiseo")) {
      ouiseo();
    } else {
      console.log("ouiseo is already open");
    }
  },
};
