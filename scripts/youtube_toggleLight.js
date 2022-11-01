export default {
  name: {
    en: "Toggle light youtube",
    vi: "Tắt/Mở đèn youtube",
  },
  description: {
    en: "Toggle light on/off to focus to video",
    vi: "Tắt/Mở đèn để tập trung xem video",
  },
  blackList: [],
  whiteList: ["www.youtube.com"],

  func: function () {
    ["#below", "#secondary", "#masthead-container"].forEach((_) => {
      let doms = document.querySelectorAll(_);
      Array.from(doms).forEach((dom) => {
        let current = dom.style.opacity || 1;
        let newValue = current == 1 ? 0 : 1;
        dom.style.opacity = newValue;
        dom.style.pointerEvents = newValue ? "" : "none";
      });
    });

    document.querySelector("#player-theater-container")?.scrollIntoView?.({
      behavior: "smooth",
    });
  },
};
