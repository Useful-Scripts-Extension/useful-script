import { langSaver } from "./storage.js";

export const LANG = {
  vi: "Tiếng Việt",
  en: "English",
};

export const LANG_KEY = Object.keys(LANG);

let currentLangKey = langSaver.get() || "vi";

export function setLang(key) {
  if (key in LANG) {
    currentLangKey = key;
    langSaver.set(key);
  } else {
    alert("WRONG LANG KEY " + key);
  }
}

export function getLang() {
  return currentLangKey;
}

export function getFlag(key = currentLangKey) {
  return "./assets/flag-" + key + ".png";
}

export function t(o) {
  if (typeof o === "string") return o;
  if (typeof o === "object") {
    for (let key of [currentLangKey, ...LANG_KEY]) {
      if (key in o && o[key] != "") {
        return o[key];
      }
    }
  }

  return "?";
}
