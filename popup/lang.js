export const LANG = {
  vi: "vi",
  en: "en",
};

let currentLangKey = LANG.vi;

export function setLang(lang) {
  if (lang in LANG) {
    currentLangKey = lang;
  } else {
    alert("WRONG LANG KEY " + lang);
  }
}

export function toggleLang() {
  let newLang = currentLangKey === LANG.vi ? LANG.en : LANG.vi;
  currentLangKey = newLang;
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
  if (typeof o === "object" && currentLangKey in o) return o[currentLangKey];
  return "?";
}
