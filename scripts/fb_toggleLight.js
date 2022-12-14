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

  getActive: async () => await await localStorage.get(key),
  setActive: async (v) => await await localStorage.set(key, v),

  contentScript: {
    onDocumentIdle: () => {
      shared.toggleLight(false);
    },
  },

  onClick: function () {
    shared.toggleLight();
  },
};

export const shared = {
  toggleLight: function (willShow) {
    [
      document.querySelectorAll('[role="navigation"]')?.[2],
      document.querySelectorAll('[role="complementary"]')?.[0],
    ].forEach((el) => {
      if (el) {
        if (willShow != null) {
          el.style.display = willShow ? "" : "none";
        } else {
          el.style.display = el.style.display != "none" ? "none" : "";
        }
      } else alert("ERROR: Cannot find element");
    });
  },
};
