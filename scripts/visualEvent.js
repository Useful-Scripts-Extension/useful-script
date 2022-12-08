export default {
  icon: "http://www.sprymedia.co.uk/favicon.ico",
  name: {
    en: "Show all javascript events",
    vi: "Xem tất cả tất cả javascript events",
  },
  description: {
    en: "Visual Event - Visually show Javascript events on a page",
    vi: "Visual Event - Hiển thị tất cả javascript events xuất hiện trong trang web",
  },

  func: function () {
    // http://www.sprymedia.co.uk/article/Visual+Event+2

    var protocol = window.location.protocol === "file:" ? "http:" : "";
    var url =
      protocol + "//www.sprymedia.co.uk/VisualEvent/VisualEvent_Loader.js";
    if (typeof VisualEvent != "undefined") {
      if (VisualEvent.instance !== null) {
        VisualEvent.close();
      } else {
        new VisualEvent();
      }
    } else {
      var n = document.createElement("script");
      n.setAttribute("language", "JavaScript");
      n.setAttribute("src", url + "?rand=" + new Date().getTime());
      document.body.appendChild(n);
    }
  },
};

// https://stackoverflow.com/a/10213800/11898496
