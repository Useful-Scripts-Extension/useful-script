export default {
  name: {
    en: "Toggle light",
    vi: "Tắt/Mở đèn",
  },
  description: {
    en: "Toggle light on/off to focus to video",
    vi: "Tắt/Mở đèn để tập trung xem video",
  },
  func: function () {
    ["#below", "#secondary", "#masthead-container"].forEach((_) => {
      let dom = document.querySelector(_);
      if (dom) {
        let current = dom.style.opacity || 1;
        let newValue = current == 1 ? 0 : 1;
        dom.style.opacity = newValue;
      } else alert("ERROR: Cannot find element" + _);
    });

    document.querySelector("#player-theater-container")?.scrollIntoView?.({
      behavior: "smooth",
    });
  },
};
