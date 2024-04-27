export default {
  icon: '<i class="fa-solid fa-bookmark fa-lg"></i>',
  name: {
    en: "Export bookmarks to file",
    vi: "Xuất bookmarks ra file",
  },
  description: {
    en: "Export all your browser's bookmarks to JSON file",
    vi: "Xuất tất cả bookmarks trong trình duyệt của bạn ra file JSON",
  },

  changeLogs: {
    1.66: {
      "2024-04-27": "support download as .json",
    },
  },

  onClickExtension: function () {
    chrome.bookmarks.getTree((tree) => {
      console.log(tree);

      UfsGlobal.Utils.downloadData(
        JSON.stringify(tree, null, 4),
        "bookmarks.json"
      );
    });
  },
};
