export function toggleLight() {
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
}
