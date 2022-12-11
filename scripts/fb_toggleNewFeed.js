import { localStorage, runScriptInCurrentTab } from "./helpers/utils.js";

const key = "ufs-fb-toggle-newfeed";

export default {
  icon: '<i class="fa-solid fa-eye-slash"></i>',
  name: {
    en: "Hide Newfeed facebook",
    vi: "Ẩn Newfeed facebook",
  },
  description: {
    en: "Hide Newfeed facebook for better focus to work",
    vi: "Ẩn Newfeed facebook để tập trung làm việc",
  },
  whiteList: ["https://www.facebook.com"],
  runInExtensionContext: true,

  checked: async () => await shared.get(),
  onDocumentEnd: async function () {
    let isOn = await shared.get();
    if (isOn) shared.toggleNewFeed(false);
  },
  onClick: async function () {
    let current = await shared.get();
    let newVal = !current;
    shared.toggleNewFeed(!newVal);
    await shared.set(newVal);
  },
};

export const shared = {
  get: async () => localStorage.get(key),
  set: async (value) => localStorage.set(key, value),
  toggleNewFeed: function (willShow) {
    runScriptInCurrentTab(
      (value) => {
        let div = document.querySelector("#ssrb_feed_end")?.parentElement;
        if (!div) alert("Không tìm thấy NewFeed.");
        else {
          div.style.display =
            value ?? div.style.display === "none" ? "block" : "none";
        }
      },
      [willShow]
    );
  },
};
