import { langSaver } from "./storage.js";

export const LANG = {
  vi: "vi",
  en: "en",
};

let currentLangKey = null;

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
  await setLang(newLang);
  return newLang;
}

export async function getLang() {
  if (!currentLangKey) currentLangKey = await langSaver.get(LANG.vi);
  return currentLangKey;
}

export async function getFlag() {
  return "./assets/flag-" + (await getLang()) + ".png";
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
