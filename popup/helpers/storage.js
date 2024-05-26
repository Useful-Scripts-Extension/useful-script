import { allScripts } from "../../scripts/index.js";

const createVariableSaver = (key, defaultValue = null) => ({
  set: (data) => {
    localStorage.setItem(key, JSON.stringify(data));
  },
  get: (_defaultValue) => {
    return (
      JSON.parse(localStorage.getItem(key) || "null") ??
      _defaultValue ??
      defaultValue
    );
  },
});

const createScriptsSaver = (key, addToHead = true) => {
  const getIds = () =>
    JSON.parse(localStorage.getItem(key) ?? "[]").filter(
      (savedScriptId) => savedScriptId in allScripts
    );
  const has = (script) => {
    let current = getIds();
    let exist = current.findIndex((id) => id === script.id) >= 0;
    return exist;
  };
  const add = (script) => {
    let current = getIds();
    let newList = current.filter((id) => id != script.id); // remove duplicate
    if (addToHead) newList.unshift(script.id); // only save script id
    else newList.push(script.id);
    localStorage.setItem(key, JSON.stringify(newList));
  };
  const remove = (script) => {
    let current = getIds();
    let newList = current.filter((id) => id !== script.id);
    localStorage.setItem(key, JSON.stringify(newList));
    console.log("removed ", script);
  };
  const toggle = (script) => {
    let exist = has(script);
    if (exist) remove(script);
    else add(script);
  };
  const clear = () => {
    localStorage.setItem(key, "[]");
  };
  const get = () => getIds().map((savedScriptId) => allScripts[savedScriptId]);

  return { add, remove, has, toggle, clear, getIds, get };
};

export const themeSaver = createVariableSaver("useful-scripts-theme");
export const langSaver = createVariableSaver("useful-scripts-lang");
export const activeTabIdSaver = createVariableSaver(
  "useful-scripts-activeTabId"
);
export const recentScriptsSaver = createScriptsSaver("useful-scripts-recently");
export const favoriteScriptsSaver = createScriptsSaver(
  "useful-scripts-favorite"
);

// default is false => enabled; true => disabled
export const smoothScrollSaver = createVariableSaver(
  "useful-scripts-smoothScroll"
);
