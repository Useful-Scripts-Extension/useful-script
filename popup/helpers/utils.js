import { t } from "./lang.js";

export function viewScriptSource(script) {
  localStorage.viewScriptSource_sharedData = JSON.stringify({
    name: t(script.name),
    id: script.id,
    description: t(script.description),
    source: script.onClick?.toString() || "window.open('" + script.link + "')",
  });

  chrome.windows.create({
    url: chrome.runtime.getURL("pages/viewScriptSource/index.html"),
    type: "popup",
    height: 450,
    width: 700,
  });
}
