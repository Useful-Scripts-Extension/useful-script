import { t } from "./lang.js";

export const getTabId = async () => {
  let tabArray = await chrome.tabs.query({ currentWindow: true, active: true });
  return tabArray[0].id;
};

export const runScript = async (func, tabId) => {
  return chrome.scripting.executeScript({
    target: { tabId: tabId },
    func: func,
    world: "MAIN",
  });
};

export const runScriptFile = (scriptFile, tabId) => {
  return chrome.scripting.executeScript({
    target: { tabId: tabId },
    files: [scriptFile],
    world: "MAIN",
  });
};

export const runScriptInCurrentTab = async (func) => {
  const tabId = await getTabId();
  return await runScript(func, tabId);
};

export const runScriptFileInCurrentTab = async (scriptFile) => {
  const tabId = await getTabId();
  return await runScriptFile(scriptFile, tabId);
};

export const openUrlInNewTab = async (url) => {
  return chrome.tabs.create({ url });
};

export const openUrlAndRunScript = async (url, func) => {
  let tab = await openUrlInNewTab(url);
  return await runScript(func, tab.id);
};

export async function getCurrentURL() {
  let tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  return tabs[0].url;
}

export function viewScriptSource(script) {
  localStorage.viewScriptSource_sharedData = JSON.stringify({
    name: t(script.name),
    id: script.id,
    description: t(script.description),
    source: script.func?.toString(),
  });

  chrome.windows.create({
    url: chrome.runtime.getURL("pages/viewScriptSource/index.html"),
    type: "popup",
    height: 450,
    width: 700,
  });
}
