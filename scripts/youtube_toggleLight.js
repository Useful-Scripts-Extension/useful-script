export default {
  icon: "https://lh3.googleusercontent.com/Apmrldj2Vnje0MIEvqYslaGRjDj2R3u72YboNiUHJ8sSORBmLCYJNJ50FTCFhXrCuXs3e6vaCTJqOKeq-I3AMkIFLw=w128-h128-e365-rj-sc0x00ffffff",
  name: {
    en: "Toggle light youtube",
    vi: "Tắt/Mở đèn youtube",
  },
  description: {
    en: "Toggle light on/off to focus to youtube video",
    vi: "Tắt/Mở đèn để tập trung xem video youtube",
  },
  whiteList: ["*://www.youtube.com/*"],

  contentScript: {
    onClick: function () {
      ["#below", "#secondary", "#masthead-container"].forEach((_) => {
        let doms = document.querySelectorAll(_);
        Array.from(doms).forEach((dom) => {
          let current = dom.style.opacity || 1;
          let newValue = current == 1 ? 0 : 1;
          dom.style.opacity = newValue;
          dom.style.pointerEvents = newValue ? "" : "none";
        });
      });

      document.querySelector("ytd-player")?.scrollIntoView?.({
        behavior: "smooth",
        block: "center",
      });
    },
  },
};
