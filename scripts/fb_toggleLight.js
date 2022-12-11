import { localStorage, runScriptInCurrentTab } from "./helpers/utils.js";

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
  runInExtensionContext: true,

  checked: async () => await shared.get(),
  onDocumentEnd: async function () {
    let isOn = await shared.get();
    if (isOn) shared.toggleLight(false);
  },
  onClick: async function () {
    let current = await shared.get();
    let newVal = !current;
    shared.toggleLight(!newVal);
    await shared.set(newVal);
  },
};

export const shared = {
  get: async () => await localStorage.get(key),
  set: async (value) => await localStorage.set(key, value),
  toggleLight: function (willShow) {
    runScriptInCurrentTab(
      (value) => {
        [
          document.querySelectorAll('[role="navigation"]')?.[2],
          document.querySelectorAll('[role="complementary"]')?.[0],
        ].forEach((el) => {
          if (el)
            el.style.display =
              value ?? el.style.display === "none" ? "block" : "none";
          else alert("ERROR: Cannot find element");
        });
      },
      [willShow]
    );
  },
};
