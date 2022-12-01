export default {
  icon: "https://www.facebook.com/favicon.ico",
  name: {
    en: "Facebook - Download video/reel/watch",
    vi: "Facebook - Tải video/reel/watch",
  },
  description: {
    en: "Download facebook video/reel/watch",
    vi: "Tải facebook video/reel/watch",
  },
  blackList: [],
  whiteList: ["https://www.facebook.com/*"],
  runInExtensionContext: false,

  func: function () {
    // Original source code: https://gist.github.com/monokaijs/270e29620c46cabec1caca8c3746729d

    function stringifyVariables(d, e) {
      let f = [],
        a;
      for (a in d)
        if (d.hasOwnProperty(a)) {
          let g = e ? e + "[" + a + "]" : a,
            b = d[a];
          f.push(
            null !== b && "object" == typeof b
              ? stringifyVariables(b, g)
              : encodeURIComponent(g) + "=" + encodeURIComponent(b)
          );
        }
      return f.join("&");
    }
    function fetchGraphQl(doc_id, variables) {
      return fetch("https://www.facebook.com/api/graphql/", {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body: stringifyVariables({
          doc_id: doc_id,
          variables: JSON.stringify(variables),
          fb_dtsg: require("DTSGInitialData").token,
          server_timestamps: !0,
        }),
      });
    }

    let url = prompt("Nhập link video/reel/watch:", location.href);
    let videoId = url.match(/\/(?:videos|reel|watch)(?:\/?)(?:\?v=)?(\d+)/);
    if (!videoId || videoId.length < 2) {
      alert(
        "Link không đúng định dạng, không tìm thấy video/reel/watch id trong link."
      );
      return;
    }

    fetchGraphQl("5279476072161634", {
      UFI2CommentsProvider_commentsKey: "CometTahoeSidePaneQuery",
      caller: "CHANNEL_VIEW_FROM_PAGE_TIMELINE",
      displayCommentsContextEnableComment: null,
      displayCommentsContextIsAdPreview: null,
      displayCommentsContextIsAggregatedShare: null,
      displayCommentsContextIsStorySet: null,
      displayCommentsFeedbackContext: null,
      feedbackSource: 41,
      feedLocation: "TAHOE",
      focusCommentID: null,
      privacySelectorRenderLocation: "COMET_STREAM",
      renderLocation: "video_channel",
      scale: 1,
      streamChainingSection: !1,
      useDefaultActor: !1,
      videoChainingContext: null,
      videoID: videoId[1],
    })
      .then((res) => res.text())
      .then((text) => {
        let a = JSON.parse(text.split("\n")[0]),
          link =
            a.data.video.playable_url_quality_hd || a.data.video.playable_url;

        if (link) {
          window.open(link);
        } else {
          throw Error("Không tìm thấy link");
        }
      })
      .catch((e) => {
        alert("Lỗi: " + e);
      });
  },
};
