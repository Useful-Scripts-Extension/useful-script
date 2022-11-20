export default {
  icon: `https://archive.ph/favicon.ico`,
  name: {
    en: "Archive the current Page online",
    vi: "Lưu trữ online trang hiện tại",
  },
  description: {
    en: "Creates an archive of the current page on archive.today.",
    vi: "Lưu trang web hiện tại lên archive.today",
  },
  runInExtensionContext: true,

  func: function () {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      var currentTab = tabs[0];
      if (currentTab?.url) {
        var a = currentTab.url.replace(/^http\:\/\/(.*)$/, "$1");
        window.open(
          "https://archive.today/?run=1&url=" + encodeURIComponent(a)
        );
      } else {
        alert("Không tìm thấy url web hiện tại");
      }
    });
  },
};
