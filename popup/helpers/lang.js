import { langSaver } from "./storage.js";

export const LANG = {
  vi: "vi",
  en: "en",
};

let currentLangKey = await langSaver.get(LANG.vi);

export async function setLang(lang) {
  if (lang in LANG) {
    currentLangKey = lang;
    await langSaver.set(lang);
  } else {
    alert("WRONG LANG KEY " + lang);
  }
}

export async function toggleLang() {
  let newLang = currentLangKey === LANG.vi ? LANG.en : LANG.vi;
  currentLangKey = newLang;
  await langSaver.set(newLang);
  return newLang;
}

export function getLang() {
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
