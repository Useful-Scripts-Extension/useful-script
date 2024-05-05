export default {
  icon: '<i class="fa-solid fa-gauge-high"></i>',
  name: {
    en: "Run Stat.js",
    vi: "Chạy stats.js",
  },
  description: {
    en: "Run stat.js in current website",
    vi: "Tính toán FPS website",
  },

  pageScript: {
    onClick: function () {
      UfsGlobal.DOM.injectScriptSrc(
        "//mrdoob.github.io/stats.js/build/stats.min.js",
        (success, error) => {
          if (success) {
            var stats = new Stats();
            document.body.appendChild(stats.dom);
            requestAnimationFrame(function loop() {
              stats.update();
              requestAnimationFrame(loop);
            });
          } else {
            alert("Inject FAILED. " + error);
          }
        }
      );
    },
  },
};
