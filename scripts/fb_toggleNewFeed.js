import {
  getCurrentTab,
  localStorage,
  runScriptInTab,
} from "./helpers/utils.js";

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

  getActive: async () => await localStorage.get(key),
  setActive: async (v) => await localStorage.set(key, v),

  contentScript: {
    onDocumentIdle: function () {
      shared.toggleNewFeed(false);
    },
  },

  onClick: async function () {
    shared.toggleNewFeed();
  },
};

export const shared = {
  toggleNewFeed: async function (willShow) {
    let div = document.querySelector("#ssrb_feed_end")?.parentElement;
    if (!div) alert("Không tìm thấy NewFeed.");
    else if (willShow != null) {
      div.style.display = willShow ? "block" : "none";
    } else {
      div.style.display = div.style.display === "none" ? "block" : "none";
    }
  },
};
