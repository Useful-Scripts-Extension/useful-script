export default {
  name: {
    en: "What font",
    vi: "Kiểm tra font chữ",
  },
  description: {
    en: "Check font used in webpage",
    vi: "Kiểm tra xem từng phần tử trong web dùng font chữ gì",
  },
  func: function () {
    let d = document;
    var e = d.createElement("script");
    e.setAttribute("type", "text/javascript");
    e.setAttribute("charset", "UTF-8");
    e.setAttribute(
      "src",
      "//www.typesample.com/assets/typesample.js?r=" + Math.random() * 99999999
    );
    e.onload = () => {
      alert("Script loaded, now use can use WhatFont.");
    };
    e.onerror = (event) => {
      alert("ERROR: " + event.message);
    };
    d.body.appendChild(e);
  },
};
