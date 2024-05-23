export default {
  icon: '<i class="fa-solid fa-eye-slash fa-lg"></i>',
  name: {
    en: "Hide Newfeed facebook",
    vi: "Ẩn Newfeed facebook",
  },
  description: {
    en: "Hide Newfeed facebook for better focus to work",
    vi: "Ẩn Newfeed facebook để tập trung làm việc",
  },
  infoLink:
    "https://www.facebook.com/groups/j2team.community/posts/1919935575005220/",
  whiteList: ["https://*.facebook.com/*"],

  contentScript: {
    onDocumentStart: () => {
      UfsGlobal.DOM.onElementsVisible("[role='feed'], [role='main']", (nodes) =>
        Array.from(nodes).forEach((node) => (node.style.display = "none"))
      );
    },

    onClick: async function () {
      [
        ...Array.from(
          document.querySelectorAll("[role='feed'], [role='main']")
        ),
        // document.querySelector("#watch_feed"),
        // document.querySelector("#ssrb_stories_start")?.parentElement,
        // document.querySelector("#ssrb_feed_start")?.parentElement,
      ].forEach((el) => {
        if (el) {
          el.style.display = el.style.display === "none" ? "" : "none";
        } else console.log("ERROR: Cannot find element");
      });
    },
  },
};
