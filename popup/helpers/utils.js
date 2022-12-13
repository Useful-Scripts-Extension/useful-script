export async function viewScriptSource(script) {
  localStorage.viewScriptSource_sharedData = script.id;

  chrome.windows.create({
    url: chrome.runtime.getURL("pages/viewScriptSource/index.html"),
    type: "popup",
    height: window.screen.height,
    width: 700,
  });
}
