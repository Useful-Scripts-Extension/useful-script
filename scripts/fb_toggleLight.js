import {
  getCurrentTab,
  localStorage,
  runScriptInCurrentTab,
  runScriptInTab,
} from "./helpers/utils.js";

const key = "ufs-fb-toggle-light";

export default {
  icon: `<i class="fa-solid fa-lightbulb"></i>`,
  name: {
    en: "Turn off light fb newfeed",
    vi: "Tắt đèn fb newfeed",
  },
  description: {
    en: "Hide Navigator bar and complementary bar in facebook",
    vi: "Ẩn giao diện 2 bên newfeed, giúp tập trung vào newfeed facebook",
  },
  whiteList: ["https://www.facebook.com"],

  getActive: async () => await shared.get(),
  setActive: async (v) => await shared.set(v),

  backgroundScript: {
    onDocumentEnd: async function () {
      console.log("fb_toggle light");
    },
  },
  contentScript: {
    onDocumentIdle: async () => {
      let isOn = await shared.get();
      if (isOn) shared.toggleLight(false);
    },
  },

  onClickExtension: async function () {
    let current = await shared.get();
    let newVal = !current;
    runScriptInCurrentTab(shared.toggleLight, [!newVal]);
    await shared.set(newVal);
  },
};

export const shared = {
  get: async () => await localStorage.get(key),
  set: async (value) => await localStorage.set(key, value),
  toggleLight: async function (willShow) {
    [
      document.querySelectorAll('[role="navigation"]')?.[2],
      document.querySelectorAll('[role="complementary"]')?.[0],
    ].forEach((el) => {
      if (el)
        el.style.display =
          willShow ?? el.style.display === "none" ? "block" : "none";
      else alert("ERROR: Cannot find element");
    });
  },
};
