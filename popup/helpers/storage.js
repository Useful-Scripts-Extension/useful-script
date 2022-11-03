import { allScripts } from "../../scripts/index.js";

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

const createVariableSaver = (key, defaultValue = null) => ({
  set: async (data) => {
    await localStorage.set(key, data);
  },
  get: async (_defaultValue) => {
    return await localStorage.get(key, _defaultValue || defaultValue);
  },
});

const createScriptsSaver = (key) => ({
  add: async (script) => {
    let current = await localStorage.get(key, []);
    current = current.filter((id) => id != script.id); // remove duplicate
    current.unshift(script.id); // only save script id
    await localStorage.set(key, current);
  },
  clear: async () => {
    await localStorage.set(key, []);
  },
  get: async () => {
    return (await localStorage.get(key, []))
      .filter((savedScriptId) => savedScriptId in allScripts)
      .map((savedScriptId) => allScripts[savedScriptId]);
  },
});

export const langSaver = createVariableSaver("useful-scripts-lang");
export const activeTabIdSaver = createVariableSaver(
  "useful-scripts-activeTabId"
);
export const recentScriptsSaver = createScriptsSaver("useful-scripts-recently");
export const favoriteScriptsSaver = createScriptsSaver(
  "useful-scripts-favorite"
);
