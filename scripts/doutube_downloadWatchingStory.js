export default {
  name: {
    en: "Download doutu.be story",
    vi: "Tải story doutu.be",
  },
  description: {
    en: "Download story that you are watching",
    vi: "Tải story bạn đang xem",
  },
  blackList: [],
  whiteList: [],
  func: function () {
    const src = document.querySelector("video")?.src;
    if (src) window.open(src);
    else alert("Không tìm thấy video story nào");
  },
};
