export function toggleLight() {
  let key = "useful-scripts/facebook/togglelight";
  let currentState = window.localStorage.getItem(key);
  let newState = currentState == 1 ? 0 : 1;

  ["navigation", "complementary"].forEach((_) => {
    let dom = document.querySelector("div[role='" + _ + "']");
    if (dom) dom.style.opacity = Number(newState);
    else alert("ERROR: Cannot find element" + _);
  });

  window.localStorage.setItem(key, newState);
}
