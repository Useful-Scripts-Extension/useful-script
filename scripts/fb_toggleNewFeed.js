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

  onDocumentStart: () => {
    UsefulScriptGlobalWebpageContext.DOM.onElementsVisible(
      "[role='feed'], [role='main']",
      (nodes) =>
        Array.from(nodes).forEach((node) => (node.style.display = "none")),
      true
    );
  },

  onClick: async function () {
    [
      ...Array.from(document.querySelectorAll("[role='feed'], [role='main']")),
      // document.querySelector("#watch_feed"),
      // document.querySelector("#ssrb_stories_start")?.parentElement,
      // document.querySelector("#ssrb_feed_start")?.parentElement,
    ].forEach((el) => {
      if (el) {
        el.style.display = el.style.display === "none" ? "" : "none";
      } else console.log("ERROR: Cannot find element");
    });
  },
};
