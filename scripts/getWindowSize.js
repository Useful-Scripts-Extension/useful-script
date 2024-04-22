export default {
  icon: `<i class="fa-solid fa-maximize fa-lg"></i>`,
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
      `Window inner dimensions:\n
      website: ${window.innerWidth} x ${window.innerHeight}
      your screen: ${screen.width} x ${screen.height}`
    );
  },
};
