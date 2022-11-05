export default {
  name: {
    en: "Download video doutu.be",
    vi: "Tải video doutu.be",
  },
  description: {
    en: "Download video doutu.be that you are watching",
    vi: "Tải video doutu.be bạn đang xem",
  },
  blackList: [],
  whiteList: [],

  func: function () {
    const isElementInViewport = (el) => {
      const rect = el.getBoundingClientRect();
      return (
        rect.bottom > 0 &&
        rect.right > 0 &&
        rect.left < window.innerWidth &&
        rect.top < window.innerHeight
      );
    };
    for (let v of Array.from(document.querySelectorAll("video")))
      if (isElementInViewport(v) && v.src) return window.open(v.src);
    alert(
      "Không tìm thấy video nào, hãy scroll tới khi nào video tự động phát rồi ấn lại bookmark nhé."
    );
  },
};
