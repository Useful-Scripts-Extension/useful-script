import { t } from "./lang.js";
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

export async function getCurrentURL() {
  let tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  let url = tabs[0].url;
  return new URL(url);
}

export async function checkBlackWhiteList(
  script,
  willAlert = true,
  hostname = null
) {
  if (!hostname) {
    hostname = (await getCurrentURL()).hostname;
  }

  let hasWhiteList = script.whiteList?.length > 0;
  let hasBlackList = script.blackList?.length > 0;
  let inWhiteList = script.whiteList?.findIndex((_) => _ === hostname) >= 0;
  let inBlackList = script.blackList?.findIndex((_) => _ === hostname) >= 0;

  let willRun =
    (!hasWhiteList && !hasBlackList) ||
    (hasWhiteList && inWhiteList) ||
    (hasBlackList && !inBlackList);

  if (!willRun && willAlert) {
    alert(
      t({
        en:
          "Script is not supported in current website: \n" +
          `+ Only run in: ${script.whiteList?.join(", ") || "<empty>"}\n` +
          `+ Not run in: ${script.blackList?.join(", ") || "empty"}`,
        vi:
          "Script không hỗ trợ website hiện tại: \n" +
          `+ Chỉ chạy tại:  ${script.whiteList?.join(", ") || "<rỗng>"}\n` +
          `+ Không chạy tại:  ${script.blackList?.join(", ") || "<rỗng>"}`,
      })
    );
  }

  return willRun;
}

export async function getAvailableScripts() {
  let hostname = (await getCurrentURL()).hostname;
  let avai = [];
  for (let script of Object.values(scriptsWithId)) {
    if (await checkBlackWhiteList(script, false, hostname)) {
      avai.push(script);
    }
  }

  // sort by relative name/description

  return avai;
}
