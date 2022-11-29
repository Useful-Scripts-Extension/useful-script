export default {
  icon: "https://lh3.googleusercontent.com/e8gqesNOLhN-0xivFcaAlwGaoftfxEJcZXcXJ1F2bhoqrozs3mCYgLhPC0qJ9izdGYRnHwfXegimH9fjj3IBwlby9ZA=w128-h128-e365-rj-sc0x00ffffff",
  name: {
    en: "Download Whatapp Story",
    vi: "Tải Whatapp Story",
  },
  description: {
    en: "Download whatapp story that you are watching",
    vi: "Tải whatapp story bạn đang xem",
  },
  whiteList: [],
  runInExtensionContext: false,

  func: function () {
    // Source code extracted from: https://chrome.google.com/webstore/detail/story-saver/mafcolokinicfdmlidhaebadidhdehpk

    var imgs = document.querySelectorAll(
      'div[data-animate-status-v3-viewer="true"] img'
    );
    if (imgs.length >= 3) {
      let storyUrl = imgs[imgs.length - 1].src;
      let username =
        imgs[0].parentElement.parentElement.nextSibling.children[0].innerText;
      let imgUrl = storyUrl + "#.jpg";
      window.open(imgUrl);
    } else {
      alert("Không tìm thấy instagram story nào trong trang web.");
    }
  },
};
