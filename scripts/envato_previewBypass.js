export default {
  icon: "https://elements.envato.com/favicon.ico",
  name: {
    en: "Envato - preview bypass",
    vi: "Envato - bypass khung xem trước",
  },
  description: {
    en: "Remove preview iframe on Envato sites (Themeforest, Codecanyon)",
    vi: "Bypass khung preview khi xem demo trong trang web Envato (Themeforest, Codecanyon)",
  },
  blackList: [],
  whiteList: [],

  onClick: function () {
    // Source code: https://gist.github.com/J2TEAM/f79f950c31cc9fe4ed705515385ed75f

    let url = document.querySelector(".full-screen-preview__frame")?.src;
    if (url) window.open(url);
    else alert("Không tìm thấy link để bypass preview Envato");
  },
};
