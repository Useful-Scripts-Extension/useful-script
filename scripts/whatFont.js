export default {
  icon: `<i class="fa-solid fa-font"></i>`,
  name: {
    en: "What font",
    vi: "Kiểm tra font chữ",
  },
  description: {
    en: "Check font used in webpage",
    vi: "Kiểm tra xem từng phần tử trong web dùng font chữ gì",
  },

  func: function () {
    // https://www.typewolf.com/type-sample

    let src = "https://www.typesample.com/assets/typesample.js";
    let d = document;
    var e = d.createElement("script");
    e.setAttribute("type", "text/javascript");
    e.setAttribute("charset", "UTF-8");
    e.setAttribute("src", src + "?r=" + Math.random() * 99999999);
    e.onload = () => {
      alert("Script loaded, now use can use WhatFont.");
    };
    e.onerror = (event) => {
      alert(
        'Looks like the Content Security Policy directive is blocking the use of script\n\nYou can copy and paste the content of:\n\n"' +
          src +
          '"\n\ninto your console instead\n\n(link is in console already)'
      );
      console.log(src);
    };
    d.body.appendChild(e);
  },
};
