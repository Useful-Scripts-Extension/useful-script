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
  if (!currentLangKey) currentLangKey = langSaver.get();
  if (!currentLangKey) {
    let index = prompt(
      "Choose language: You can change it later at flag icon (top-right corner)\n\n" +
        "Chọn ngôn ngữ: Bạn có thể đổi sau bằng cách click lá cờ góc trên bên phải tiện ích\n\n" +
        "1. Tiếng Việt\n2. English",
      1
    );

    currentLangKey = index == 2 ? LANG.en : LANG.vi;
    langSaver.set(currentLangKey);
  }
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
