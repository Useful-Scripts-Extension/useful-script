export default {
  icon: "https://archive.org/images/glogo.jpg",
  name: {
    en: "Open wayback url",
    vi: "Xem wayback url của website",
  },
  description: {
    en: "Open wayback url for website",
    vi: "Giúp xem nội dung website trong quá khứ",
  },
  runInExtensionContext: true,

  func: function () {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      var currentTab = tabs[0];
      if (currentTab?.url) {
        let url = prompt("Enter web url to check", currentTab.url);
        if (url) {
          window.open("https://web.archive.org/web/*/" + url);
        }
      } else {
        alert("Không tìm thấy url web hiện tại");
      }
    });
  },
};
