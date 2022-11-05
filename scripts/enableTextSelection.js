export default {
  icon: `<i class="fa-solid fa-arrow-pointer"></i>`,
  name: {
    en: "Re-Enable text selection",
    vi: "Bật text selection",
  },
  description: {
    en: "Enable text selection for website",
    vi: "Dùng cho web nào không cho phép bôi đen văn bản",
  },

  func: function () {
    function R(a) {
      ona = "on" + a;
      if (window.addEventListener)
        window.addEventListener(
          a,
          function (e) {
            for (var n = e.originalTarget; n; n = n.parentNode) n[ona] = null;
          },
          true
        );
      window[ona] = null;
      document[ona] = null;
      if (document.body) document.body[ona] = null;
    }
    R("click");
    R("mousedown");
    R("mouseup");
    R("selectstart");
  },
};
