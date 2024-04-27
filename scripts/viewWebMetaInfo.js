export default {
  icon: "https://s2.googleusercontent.com/s2/favicons?domain_url=https://www.ouiseo.com/",
  name: {
    en: "See web meta info (SEO)",
    vi: "Xem thông tin meta của web (SEO)",
  },
  description: {
    en: "Instantly shows meta information about the current site in an on-page iFrame.",
    vi: "Xem thông tin meta của website trực tiếp trong trang web",
  },

  onClick: async function () {
    // source code from: https://bookmarklet.vercel.app/

    if (window.ouiseo === undefined) {
      await UfsGlobal.DOM.injectScriptSrc(
        "//carlsednaoui.s3.amazonaws.com/ouiseo/ouiseo.min.js",
        (success, fail) => {
          if (success) {
            console.log("ouiseo injected");
            ouiseo();
          } else {
            alert("Inject script failed. Cannot run script in this website");
          }
        }
      );
    } else if (!!window.ouiseo && !document.getElementById("ouiseo")) {
      ouiseo();
    } else {
      console.log("ouiseo is already open");
    }
  },
};
