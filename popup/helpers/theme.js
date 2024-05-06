import { themeSaver } from "./storage.js";

const cssTag = document.querySelector("link[rel='stylesheet/less']");

export const THEME = {
  default: {
    vi: "Mặc định",
    en: "Default",
  },
  xtr98: "xtr98",
};

export const THEME_KEY = Object.keys(THEME);

let currentThemeKey = themeSaver.get() || "default";
setTheme(currentThemeKey);

export function getTheme() {
  return currentThemeKey;
}

export function setTheme(themeKey) {
  if (themeKey in THEME) {
    currentThemeKey = themeKey;
    themeSaver.set(themeKey);
    cssTag.href = `styles/${themeKey}.less`;

    // remove old compiled css
    document.querySelector("style[id^=less]")?.remove?.();

    // compile new css
    less?.refresh?.();
  } else {
    alert("WRONG THEME KEY " + themeKey);
  }
}
