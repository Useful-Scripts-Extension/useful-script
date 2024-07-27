import { BADGES } from "./helpers/badge.js";

export default {
  icon: '<i class="fa-regular fa-object-group fa-2x"></i>',
  name: {
    en: "Picture in Picture",
    vi: "Picture in Picture",
  },
  description: {
    en: "Watch videos in a floating window",
    vi: "Xem video trong cửa sổ nổi",
  },
  badges: [BADGES.hot],
  changeLogs: {
    "2024-06-05": "fix video in iframes",
    "2024-07-19": "fix video that disable pip",
  },

  contentScript: {
    onClick_: async function () {
      const { UfsGlobal } = await import("./content-scripts/ufs_global.js");

      const Mark = "__pip__";

      function findLargestPlayingVideoInViewport() {
        const videos = Array.from(document.querySelectorAll("video"))
          .filter((video) => video.readyState != 0)
          .sort(
            (v1, v2) =>
              UfsGlobal.DOM.getOverlapScore(v2) -
              UfsGlobal.DOM.getOverlapScore(v1)
          );
        if (videos.length === 0) {
          return;
        }
        return videos[0];
      }
      async function requestPictureInPicture(video) {
        await video.requestPictureInPicture();
        video.setAttribute(Mark, true);
        video.addEventListener(
          "leavepictureinpicture",
          (event) => {
            video.removeAttribute(Mark);
          },
          {
            once: true,
          }
        );
        new ResizeObserver(maybeUpdatePictureInPictureVideo).observe(video);
      }
      function maybeUpdatePictureInPictureVideo(entries, observer) {
        const observedVideo = entries[0].target;
        if (!document.querySelector("[" + Mark + "]")) {
          observer.unobserve(observedVideo);
          return;
        }
        const video = findLargestPlayingVideoInViewport();
        if (video && !video.hasAttribute(Mark)) {
          observer.unobserve(observedVideo);
          requestPictureInPicture(video);
        }
      }
      (async () => {
        const video = findLargestPlayingVideoInViewport();
        if (!video) return;
        if (video.disablePictureInPicture)
          video.disablePictureInPicture = false;
        if (video.hasAttribute(Mark)) {
          document.exitPictureInPicture();
          return;
        }
        await requestPictureInPicture(video);
      })();
    },
  },
};
