import {
  getCurrentTab,
  runScriptInCurrentTab,
  showLoading,
} from "./helpers/utils.js";

export default {
  icon: '<i class="fa-solid fa-video"></i>',
  name: {
    en: "Download fb video/reel/watch from url",
    vi: "Tải video/reel/watch fb từ url",
  },
  description: {
    en: "Download facebook video/reel/watch",
    vi: "Tải facebook video/reel/watch",
  },
    whiteList: ["https://www.facebook.com/*"],

  onClickExtension: async function () {
    let tab = await getCurrentTab();
    let url = prompt("Nhập link video/reel/watch:", tab.url);
    let videoId = shared.extractFbVideoIdFromUrl(url);
    if (!videoId) {
      alert(
        "Link không đúng định dạng, không tìm thấy video/reel/watch id trong link."
      );
      return;
    }

    let { closeLoading, setLoadingText } = showLoading("Đang lấy token...");
    try {
      let dtsg = await shared.getDtsg();
      setLoadingText("Đang get link video...");
      let link = await shared.getLinkFbVideo(videoId, dtsg);
      if (link) window.open(link);
      else throw Error("Không tìm thấy link");
    } catch (e) {
      alert("ERROR: " + e);
    } finally {
      closeLoading();
    }
  },
};

export const shared = {
  extractFbVideoIdFromUrl: function (url) {
    return url.match(/\/(?:videos|reel|watch)(?:\/?)(?:\?v=)?(\d+)/)?.[1];
  },

  getDtsg: async function () {
    return await runScriptInCurrentTab(() => {
      return require("DTSGInitialData").token;
    });
  },

  stringifyVariables: function (d, e) {
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
  },

  getLinkFbVideo: async function (videoId, dtsg) {
    try {
      return await shared.getLinkFbVideo2(videoId, dtsg);
    } catch (e) {
      return await shared.getLinkFbVideo1(videoId, dtsg);
    }
  },

  // Original source code: https://gist.github.com/monokaijs/270e29620c46cabec1caca8c3746729d
  // POST FB: https://www.facebook.com/groups/j2team.community/posts/1880294815635963/
  // Cần thêm rule trong rule.jsons để hàm này có thể chạy trong extension context
  getLinkFbVideo1: async function (videoId, dtsg) {
    function fetchGraphQl(doc_id, variables) {
      return fetch("https://www.facebook.com/api/graphql/", {
        method: "POST",
        headers: {
          "content-type": "application/x-www-form-urlencoded",
        },
        body: shared.stringifyVariables({
          doc_id: doc_id,
          variables: JSON.stringify(variables),
          fb_dtsg: dtsg,
          server_timestamps: !0,
        }),
      });
    }

    let res = await fetchGraphQl("5279476072161634", {
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
      videoID: videoId,
    });
    let text = await res.text();

    let a = JSON.parse(text.split("\n")[0]),
      link = a.data.video.playable_url_quality_hd || a.data.video.playable_url;

    return link;
  },

  // DYL extension: faster
  getLinkFbVideo2: async function (videoId, dtsg) {
    let res = await fetch(
      "https://www.facebook.com/video/video_data_async/?video_id=" + videoId,
      {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body: shared.stringifyVariables({
          __a: "1",
          fb_dtsg: dtsg,
        }),
      }
    );

    let text = await res.text();
    console.log(text);
    text = text.replace("for (;;);", "");
    let json = JSON.parse(text);

    const { hd_src, hd_src_no_ratelimit, sd_src, sd_src_no_ratelimit } =
      json?.payload || {};

    return hd_src_no_ratelimit || hd_src || sd_src_no_ratelimit || sd_src;
  },

  // DYL extension: use access token
  getLinkFbVideo3: async function (videoId, access_token) {
    let res = await fetch(
      "https://graph.facebook.com/v8.0/" +
        videoId +
        "?fields=source&access_token=" +
        access_token
    );
    let json = await res.json();
    return json.source;
  },
};
