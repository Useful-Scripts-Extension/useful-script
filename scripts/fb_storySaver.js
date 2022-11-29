export default {
  icon: "https://lh3.googleusercontent.com/e8gqesNOLhN-0xivFcaAlwGaoftfxEJcZXcXJ1F2bhoqrozs3mCYgLhPC0qJ9izdGYRnHwfXegimH9fjj3IBwlby9ZA=w128-h128-e365-rj-sc0x00ffffff",
  name: {
    en: "Download watching Facebook Story",
    vi: "Tải Story Facebook đang xem",
  },
  description: {
    en: "Download facebook story that you are watching",
    vi: "Tải facebook story bạn đang xem",
  },
  whiteList: [],
  runInExtensionContext: false,

  func: function () {
    // Source code extracted from: https://chrome.google.com/webstore/detail/story-saver/mafcolokinicfdmlidhaebadidhdehpk

    let videos = document.querySelectorAll("video");
    let videoUrl = null;
    for (var i = videos.length - 1; i >= 0; i--) {
      if (videos[i].offsetHeight === 0) continue;
      var reactKey = "";
      keys = Object.keys(videos[i]);
      for (var j = 0; j < keys.length; j++) {
        if (keys[j].indexOf("__reactFiber") != -1) {
          reactKey = keys[j].split("__reactFiber")[1];
          break;
        }
      }
      try {
        //prettier-ignore
        videoUrl = videos[i].parentElement.parentElement.parentElement.parentElement['__reactProps' + reactKey].children[0].props.children.props.implementations[1].data.hdSrc;
      } catch (e) {}
      if (videoUrl == null) {
        try {
          //prettier-ignore
          videoUrl = videos[i].parentElement.parentElement.parentElement.parentElement['__reactProps' + reactKey].children[0].props.children.props.implementations[1].data.sdSrc;
        } catch (e) {}
      }
      if (videoUrl == null) {
        try {
          //prettier-ignore
          videoUrl = videos[i].parentElement.parentElement.parentElement.parentElement['__reactProps' + reactKey].children.props.children.props.implementations[1].data.hdSrc;
        } catch (e) {}
      }
      if (videoUrl == null) {
        try {
          //prettier-ignore
          videoUrl = videos[i].parentElement.parentElement.parentElement.parentElement['__reactProps' + reactKey].children.props.children.props.implementations[1].data.sdSrc;
        } catch (e) {}
      }
      if (videoUrl == null) {
        try {
          //prettier-ignore
          videoUrl = videos[i]['__reactFiber' + reactKey].return.stateNode.props.videoData.$1.hd_src;
        } catch (e) {}
      }
      if (videoUrl == null) {
        try {
          //prettier-ignore
          videoUrl = videos[i]['__reactFiber' + reactKey].return.stateNode.props.videoData.$1.sd_src;
        } catch (e) {}
      }
      if (videoUrl != null) break;
    }

    if (!videoUrl) alert("Không tìm thấy facebook story nào trong trang web.");
    else window.open(videoUrl);
  },
};
