export default {
  icon: `<i class="fa-solid fa-circle-half-stroke fa-lg"></i>`,
  name: {
    en: "Darkmode for pdf",
    vi: "Chế độ tối cho PDF",
  },
  description: {
    en: "Enable/Disable darkmode for PDF",
    vi: "Bật/Tắt chế độ tối cho PDF bạn đang xem",
  },

  pageScript: {
    onClick: function () {
      let id = "useful-scripts-darkModePDF";

      let old = document.querySelector("#" + id);
      if (old) old.remove();
      else {
        var cover = document.createElement("div");
        cover.id = id;
        let css = `position: fixed;
        pointer-events: none;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: #fffbfbcf;
        mix-blend-mode: difference;
        z-index: 99999;`;
        cover.setAttribute("style", css);
        document.body.appendChild(cover);
      }
    },
  },
};
