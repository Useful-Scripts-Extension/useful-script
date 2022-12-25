import { langSaver } from "./storage.js";

export const LANG = {
  vi: "vi",
  en: "en",
};

let currentLangKey = null;

export function setLang(lang) {
  if (lang in LANG) {
    currentLangKey = lang;
    langSaver.set(lang);
  } else {
    alert("WRONG LANG KEY " + lang);
  }
}

export function toggleLang() {
  let newLang = currentLangKey === LANG.vi ? LANG.en : LANG.vi;
  currentLangKey = newLang;
  setLang(newLang);
  return newLang;
}

export function getLang() {
  if (!currentLangKey) currentLangKey = langSaver.get(LANG.vi);
  return currentLangKey;
}

export function getFlag() {
  return "./assets/flag-" + getLang() + ".png";
}

export function t(o) {
  if (typeof o === "string") return o;
  if (typeof o === "object") {
    for (let key of [currentLangKey, LANG.vi, LANG.en]) {
      if (key in o && o[key] != "") {
        return o[key];
      }
    }
  }

  return "?";
}
