export default {
  name: {
    en: "View website stack",
    vi: "Web dùng công nghệ gì",
  },
  description: {
    en: "Technology that current website is using",
    vi: "Xem những công nghệ/thư viện trang web đang dùng",
  },
  func: function () {
    var d = document,
      e = d.getElementById("wappalyzer-container");
    if (e !== null) {
      d.body.removeChild(e);
    }
    var u = "https://www.wappalyzer.com/",
      t = new Date().getTime(),
      c = d.createElement("div"),
      p = d.createElement("div"),
      l = d.createElement("link"),
      s = d.createElement("script");
    c.setAttribute("id", "wappalyzer-container");
    l.setAttribute("rel", "stylesheet");
    l.setAttribute("href", u + "css/bookmarklet.css");
    d.head.appendChild(l);
    p.setAttribute("id", "wappalyzer-pending");
    p.setAttribute(
      "style",
      "background-image: url(" + u + "images/spinner.gif) !important"
    );
    c.appendChild(p);
    s.setAttribute("src", u + "bookmarklet/wappalyzer.js");
    s.onload = function () {
      window.wappalyzer = new Wappalyzer();
      s = d.createElement("script");
      s.setAttribute("src", u + "bookmarklet/apps.js");
      s.onload = function () {
        s = d.createElement("script");
        s.setAttribute("src", u + "bookmarklet/driver.js");
        c.appendChild(s);
      };
      c.appendChild(s);
    };
    c.appendChild(s);
    d.body.appendChild(c);
  },
};
