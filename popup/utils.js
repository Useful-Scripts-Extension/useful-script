import { scriptsWithId } from "./scriptsWithId.js";

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

// https://developer.chrome.com/docs/extensions/reference/storage/
export const localStorage = {
  set: async (key, value) => {
    return chrome.storage.sync.set({ [key]: value });
  },
  get: async (key, defaultValue = "") => {
    let result = await chrome.storage.sync.get([key]);
    return result[key] || defaultValue;
  },
};

export const recentScripts = {
  key: "useful-script-recently",
  maxLength: 20,
  add: async (script) => {
    let current = await localStorage.get(recentScripts.key, []);
    current = current.filter((_) => _.id != script.id); // remove duplicate
    current.unshift(script);
    if (current.length > recentScripts.maxLength) current.pop();

    await localStorage.set(recentScripts.key, current);
  },
  clear: async () => {
    await localStorage.set(recentScripts.key, []);
  },
  get: async () => {
    return (await localStorage.get(recentScripts.key, []))
      .filter((savedScript) => savedScript.id in scriptsWithId)
      .map((savedScript) => ({
        ...scriptsWithId[savedScript.id],
        badges: savedScript.badges,
      }));
  },
};
