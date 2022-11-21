export default {
  icon: `https://s2.googleusercontent.com/s2/favicons?domain=downforeveryoneorjustme.com`,
  name: {
    en: "Dowfor - Check web die",
    vi: "Dowfor - Kiểm tra web die",
  },
  description: {
    en: "Check web die using downforeveryoneorjustme",
    vi: "Dùng bên thứ 3 để kiểm tra xem website có bị die thật không",
  },
  runInExtensionContext: true,

  func: function () {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      var currentTab = tabs[0];
      if (currentTab?.url) {
        let url = prompt("Enter web url to check", currentTab.url);
        if (url) {
          window.open("https://downforeveryoneorjustme.com/" + url);
        }
      } else {
        alert("Không tìm thấy url web hiện tại");
      }
    });
  },
};
