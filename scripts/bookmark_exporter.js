export default {
  icon: '<i class="fa-solid fa-bookmark"></i>',
  name: {
    en: "Export bookmarks to file",
    vi: "Xuất bookmarks ra file",
  },
  description: {
    en: "",
    vi: "",
  },
  runInExtensionContext: true,

  onClick: function () {
    chrome.bookmarks.getTree((tree) => {
      console.log(tree);
    });
  },
};

export const shared = {};
