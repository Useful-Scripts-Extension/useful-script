export default {
  icon: "https://lh3.googleusercontent.com/cvfpnTKw3B67DtM1ZpJG2PNAIjP6hVMOyYy403X4FMkOuStgG1y4cjCn21vmTnnsip1dTZSVsWBA9IxutGuA3dVDWhg=w128-h128-e365-rj-sc0x00ffffff",
  name: {
    en: "Picture in Picture",
    vi: "Picture in Picture",
  },
  description: {
    en: "Watch videos in a floating window",
    vi: "Xem video trong cửa sổ nổi",
  },

  onClick: function () {
    function findLargestPlayingVideoInViewport() {
      const videos = Array.from(document.querySelectorAll("video"))
        .filter((video) => video.readyState != 0)
        .filter((video) => video.disablePictureInPicture == false)
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
      video.setAttribute("__pip__", true);
      video.addEventListener(
        "leavepictureinpicture",
        (event) => {
          video.removeAttribute("__pip__");
        },
        {
          once: true,
        }
      );
      new ResizeObserver(maybeUpdatePictureInPictureVideo).observe(video);
    }
    function maybeUpdatePictureInPictureVideo(entries, observer) {
      const observedVideo = entries[0].target;
      if (!document.querySelector("[__pip__]")) {
        observer.unobserve(observedVideo);
        return;
      }
      const video = findLargestPlayingVideoInViewport();
      if (video && !video.hasAttribute("__pip__")) {
        observer.unobserve(observedVideo);
        requestPictureInPicture(video);
      }
    }
    (async () => {
      const video = findLargestPlayingVideoInViewport();
      if (!video) {
        alert("Không tìm thấy video nào");
        return;
      }
      if (video.hasAttribute("__pip__")) {
        document.exitPictureInPicture();
        return;
      }
      await requestPictureInPicture(video);
    })();
  },
};
