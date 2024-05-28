import { UfsGlobal } from "./content-scripts/ufs_global.js";

export default {
  icon: '<i class="fa-solid fa-gauge-high fa-lg"></i>',
  name: {
    en: "Show FPS",
    vi: "Hiện thị FPS",
  },
  description: {
    en: "Show frames per second of current website (inject stat.js library)",
    vi: "Hiện thị tốc độ khung hình của trang web hiện tại (sử dụng thư viện stat.js)",
  },

  pageScript: {
    onClick: async function () {
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
