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
  whiteList: ["https://www.facebook.com/*"],

  contentScript: {
    onDocumentIdle: function () {
      shared.toggleNewFeed(false);
    },
  },

  onClickContentScript: async function () {
    shared.toggleNewFeed();
  },
};

export const shared = {
  toggleNewFeed: async function (willShow) {
    [
      ...Array.from(document.querySelectorAll("[role='feed'], [role='main']")),
      document.querySelector("#watch_feed"),
      document.querySelector("#ssrb_stories_start")?.parentElement,
      document.querySelector("#ssrb_feed_start")?.parentElement,
    ].forEach((el) => {
      if (el) {
        if (willShow != null) {
          el.style.display = willShow ? "block" : "none";
        } else {
          el.style.display = el.style.display === "none" ? "block" : "none";
        }
      } else console.log("ERROR: Cannot find element");
    });
  },
};
