export default {
  name: {
    en: "Darkmode for pdf",
    vi: "Chế độ tối cho PDF",
  },
  description: {
    en: "Enable darkmode for PDF",
    vi: "Bật chế độ tối cho PDF bạn đang xem",
  },
  func: function () {
    var cover = document.createElement("div");
    let css = `position: fixed;
    pointer-events: none;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: #fffbfbcf;
    mix-blend-mode: difference;
    z-index: 1;`;
    cover.setAttribute("style", css);
    document.body.appendChild(cover);
  },
};

