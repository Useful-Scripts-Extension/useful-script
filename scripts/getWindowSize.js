export default {
  icon: `<i class="fa-solid fa-maximize"></i>`,
  name: {
    en: "Get window size",
    vi: "Lấy kích thước trang web",
  },
  description: {
    en: "Alerts the width and height in pixels of the inner window.",
    vi: "đơn vị pixels",
  },

  onClick: function () {
    alert(
      "Window inner dimensions:\n\n   " +
        document.body.clientWidth +
        " x " +
        document.body.clientHeight
    );
  },
};
