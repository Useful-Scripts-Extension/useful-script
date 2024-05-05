export default {
  icon: "https://lh3.googleusercontent.com/e8gqesNOLhN-0xivFcaAlwGaoftfxEJcZXcXJ1F2bhoqrozs3mCYgLhPC0qJ9izdGYRnHwfXegimH9fjj3IBwlby9ZA=w128-h128-e365-rj-sc0x00ffffff",
  name: {
    en: "Download watching fb Story",
    vi: "Tải Story fb đang xem",
  },
  description: {
    en: "Download facebook story that you are watching",
    vi: "Tải facebook story bạn đang xem",
  },

  pageScript: {
    onClick: function () {
      // Source code extracted from: https://chrome.google.com/webstore/detail/story-saver/mafcolokinicfdmlidhaebadidhdehpk

      let videos = document.querySelectorAll("video");
      let listUrls = [];

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
        let storyUrl;
        try {
          //prettier-ignore
          storyUrl = videos[i].parentElement.parentElement.parentElement.parentElement['__reactProps' + reactKey].children[0].props.children.props.implementations[1].data.hdSrc;
        } catch (e) {}
        if (storyUrl == null) {
          try {
            //prettier-ignore
            storyUrl = videos[i].parentElement.parentElement.parentElement.parentElement['__reactProps' + reactKey].children[0].props.children.props.implementations[1].data.sdSrc;
          } catch (e) {}
        }
        if (storyUrl == null) {
          try {
            //prettier-ignore
            storyUrl = videos[i].parentElement.parentElement.parentElement.parentElement['__reactProps' + reactKey].children.props.children.props.implementations[1].data.hdSrc;
          } catch (e) {}
        }
        if (storyUrl == null) {
          try {
            //prettier-ignore
            storyUrl = videos[i].parentElement.parentElement.parentElement.parentElement['__reactProps' + reactKey].children.props.children.props.implementations[1].data.sdSrc;
          } catch (e) {}
        }
        if (storyUrl == null) {
          try {
            //prettier-ignore
            storyUrl = videos[i]['__reactFiber' + reactKey].return.stateNode.props.videoData.$1.hd_src;
          } catch (e) {}
        }
        if (storyUrl == null) {
          try {
            //prettier-ignore
            storyUrl = videos[i]['__reactFiber' + reactKey].return.stateNode.props.videoData.$1.sd_src;
          } catch (e) {}
        }
        if (storyUrl != null) {
          listUrls.push({ url: storyUrl, type: "video" });
        }
      }

      let storyImgUrl = Array.from(
        document.querySelectorAll('div[data-id] img[draggable="false"]')
      ).find((_) => _.alt)?.src;
      if (storyImgUrl) {
        listUrls.push({ url: storyImgUrl, type: "img" });
      }

      if (!listUrls.length) {
        alert("Không tìm thấy facebook story nào trong trang web.");
      } else if (listUrls.length === 1) {
        UfsGlobal.Utils.downloadURL(listUrls[0].url, "fb_story_video.mp4");
      } else {
        let w = window.open("", "", "width=500,height=700");
        w.document.write(
          listUrls
            .map(({ url, type }) =>
              type === "video"
                ? `<video controls src="${url}" style="max-width:300px"></video>`
                : type === "img"
                ? `<img src="${url}" style="max-width:300px" />`
                : ""
            )
            .join("<br/>")
        );
      }
    },
  },
};
