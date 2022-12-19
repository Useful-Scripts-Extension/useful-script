export default {
  icon: `<i class="fa-solid fa-droplet-slash fa-lg"></i>`,
  name: {
    en: "Remove all colors in web",
    vi: "Xoá màu website",
  },
  description: {
    en: "Remove all colours in the web",
    vi: "Xoá mọi màu có trong website",
  },

  onClick: function () {
    var newSS,
      styles =
        "* { background: white ! important; color: black !important } :link, :link * { color: #0000EE !important } :visited, :visited * { color: #551A8B !important }";
    if (document.createStyleSheet) {
      document.createStyleSheet("javascript:'" + styles + "'");
    } else {
      newSS = document.createElement("link");
      newSS.rel = "stylesheet";
      newSS.href = "data:text/css," + escape(styles);
      document.getElementsByTagName("head")[0].appendChild(newSS);
    }
  },
};
