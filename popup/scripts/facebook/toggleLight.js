export default {
  name: {
    en: "Hide side UI",
    vi: "Ẩn giao diện 2 bên",
  },
  description: {
    en: "Hide Navigator bar and complementary bar",
    vi: "Ẩn giao diện 2 bên newfeed, giúp tập trung vào newfeed",
  },
  func() {
    let key = "useful-scripts/facebook/togglelight";
    let currentState = window.localStorage.getItem(key);
    let newState = currentState == 1 ? 0 : 1;

    ["navigation", "complementary"].forEach((_) => {
      let dom = document.querySelector(`div[role='${_}']`);
      if (dom) dom.style.opacity = Number(newState);
      else alert("ERROR: Cannot find element" + _);
    });

    window.localStorage.setItem(key, newState);
  },
};
