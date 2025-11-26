// ⚡ LAZY LOADING OPTIMIZATION
// Import only metadata instead of full scripts for faster popup loading
import metadata from "../../scripts/@metadata.js";

const createScriptsSaver = (key, addToHead = true) => {
  const getIds = () =>
    JSON.parse(localStorage.getItem(key) ?? "[]").filter(
      (savedScriptId) => savedScriptId in metadata
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
  const get = () => getIds().map((savedScriptId) => metadata[savedScriptId]);

  return { add, remove, has, toggle, clear, getIds, get };
};

export const recentScriptsSaver = createScriptsSaver("useful-scripts-recently");
export const favoriteScriptsSaver = createScriptsSaver(
  "useful-scripts-favorite"
);
