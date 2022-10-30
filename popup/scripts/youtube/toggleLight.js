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
    let key = "useful-scripts/youtube/togglelight";
    let currentState = window.localStorage.getItem(key);
    let newState = currentState == 1 ? 0 : 1;

    ["#below", "#secondary", "#masthead-container"].forEach((_) => {
      let dom = document.querySelector(_);
      if (dom) dom.style.opacity = Number(newState);
      else alert("ERROR: Cannot find element" + _);
    });

    document.querySelector("#player-theater-container")?.scrollIntoView?.({
      behavior: "smooth",
    });

    window.localStorage.setItem(key, newState);
  },
};
