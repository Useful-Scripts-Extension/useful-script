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

const createScriptsSaver = (key) => {
  const getIds = async () =>
    (await localStorage.get(key, [])).filter(
      (savedScriptId) => savedScriptId in allScripts
    );
  const has = async (script) => {
    let current = await getIds();
    let exist = current.findIndex((id) => id === script.id) >= 0;
    return exist;
  };
  const add = async (script, addToHead = true) => {
    let current = await getIds();
    let newList = current.filter((id) => id != script.id); // remove duplicate
    if (addToHead) newList.unshift(script.id); // only save script id
    else newList.push(script.id);
    await localStorage.set(key, newList);
  };
  const remove = async (script) => {
    let current = await getIds();
    let newList = current.filter((id) => id !== script.id);
    await localStorage.set(key, newList);
    console.log("removed ", script);
  };
  const toggle = async (script) => {
    let exist = await has(script);
    if (exist) await remove(script);
    else await add(script);
  };
  const clear = async () => {
    await localStorage.set(key, []);
  };
  const get = async () =>
    (await getIds()).map((savedScriptId) => allScripts[savedScriptId]);

  return { add, remove, has, toggle, clear, getIds, get };
};

export const langSaver = createVariableSaver("useful-scripts-lang");
export const activeTabIdSaver = createVariableSaver(
  "useful-scripts-activeTabId"
);
export const recentScriptsSaver = createScriptsSaver("useful-scripts-recently");
export const favoriteScriptsSaver = createScriptsSaver(
  "useful-scripts-favorite"
);
