import { t } from "./lang.js";

export async function viewScriptSource(script) {
  localStorage.viewScriptSource_sharedData = script.id;
  //  JSON.stringify({
  //   id: script.id,
  //   name: t(script.name),
  //   description: t(script.description),
  //   source: await getScriptSource(script),
  // });

  chrome.windows.create({
    url: chrome.runtime.getURL("pages/viewScriptSource/index.html"),
    type: "popup",
    height: 450,
    width: 700,
  });
}
