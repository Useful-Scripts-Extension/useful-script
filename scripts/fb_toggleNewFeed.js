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

  onDocumentIdle: function () {
    [
      ...Array.from(document.querySelectorAll("[role='feed'], [role='main']")),
      document.querySelector("#watch_feed"),
      document.querySelector("#ssrb_stories_start")?.parentElement,
      document.querySelector("#ssrb_feed_start")?.parentElement,
    ].forEach((el) => {
      if (el) {
        el.style.display = "none";
      } else console.log("ERROR: Cannot find element");
    });
  },

  onClickContentScript: async function () {
    [
      ...Array.from(document.querySelectorAll("[role='feed'], [role='main']")),
      document.querySelector("#watch_feed"),
      document.querySelector("#ssrb_stories_start")?.parentElement,
      document.querySelector("#ssrb_feed_start")?.parentElement,
    ].forEach((el) => {
      if (el) {
        el.style.display = el.style.display === "none" ? "block" : "none";
      } else console.log("ERROR: Cannot find element");
    });
  },
};
