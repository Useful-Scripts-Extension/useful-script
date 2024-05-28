import { themeSaver } from "./storage.js";

const cssTag = document.querySelector("link[rel='stylesheet/less']");

const me = {
  name: "HoangTran",
  link: "https://github.com/hoangTran0410",
  avatar: "https://avatars.githubusercontent.com/u/36368107",
};

export const THEME = {
  default: {
    vi: "Sáng",
    en: "Light",
    author: me,
  },
  default_dark: {
    vi: "Tối",
    en: "Dark",
    author: me,
  },
  xtri98: {
    en: "xtri98",
    vi: "xtri98",
    author: {
      name: "xtri98",
      link: "https://github.com/xtri98",
      avatar: "https://avatars.githubusercontent.com/u/154915091",
    },
  },
};

export const THEME_KEY = Object.keys(THEME);

let currentThemeKey = themeSaver.get() || "default";
if (currentThemeKey !== "default") setTheme(currentThemeKey);

export function getTheme() {
  return currentThemeKey;
}

export function setTheme(themeKey) {
  if (themeKey in THEME) {
    currentThemeKey = themeKey;
    themeSaver.set(themeKey);
    cssTag.href = `themes/${themeKey}.less`;

    // remove old compiled css
    document.querySelector("style[id^=less]")?.remove?.();

    // compile new css
    less?.refresh?.();
  } else {
    alert("WRONG THEME KEY " + themeKey);
  }
}
