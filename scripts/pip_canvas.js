import { UfsGlobal } from "./content-scripts/ufs_global.js";

export default {
  icon: "https://lh3.googleusercontent.com/cvfpnTKw3B67DtM1ZpJG2PNAIjP6hVMOyYy403X4FMkOuStgG1y4cjCn21vmTnnsip1dTZSVsWBA9IxutGuA3dVDWhg=w128-h128-e365-rj-sc0x00ffffff",
  name: {
    en: "PIP for canvas",
    vi: "PIP cho canvas",
  },
  description: {
    en: "Picture in picture mode for canvas",
    vi: "Picture in picture: Xem canvas trong của sổ nổi",
    img: "",
  },

  changeLogs: {
    "2024-04-29": "init",
  },

  contentScript: {
    // https://stackoverflow.com/a/61301293/23648002
    onClick_: async () => {
      if (!window.ufs_pip_fullWebsite) {
        window.ufs_pip_fullWebsite = {
          isPIP: false,
          video: null,
          stream: null,
        };
      }

      function enterPIP(stream, video) {
        window.ufs_pip_fullWebsite.isPIP = true;
        window.ufs_pip_fullWebsite.video = video;
        window.ufs_pip_fullWebsite.stream = stream;
        video.requestPictureInPicture();
      }

      function leavePIP() {
        if (document.pictureInPictureElement) document.exitPictureInPicture();
        window.ufs_pip_fullWebsite.isPIP = false;
        window.ufs_pip_fullWebsite.video?.remove?.();
        window.ufs_pip_fullWebsite.stream
          ?.getVideoTracks?.()
          .forEach((track) => {
            track.stop();
          });
        window.ufs_pip_fullWebsite.stream = null;
      }

      function findLargestCanvasInViewport() {
        return Array.from(document.querySelectorAll("canvas")).sort(
          (a, b) =>
            UfsGlobal.DOM.getOverlapScore(b) - UfsGlobal.DOM.getOverlapScore(a)
        )?.[0];
      }

      try {
        if (window.ufs_pip_fullWebsite.isPIP) {
          leavePIP();
          return;
        }

        const largestCanvas = findLargestCanvasInViewport();

        if (!largestCanvas) {
          leavePIP();
          return;
        }

        const stream = largestCanvas.captureStream();
        const video = document.createElement("video");
        video.srcObject = stream;
        video.autoplay = true;
        video.style.display = "none";
        video.addEventListener("enterpictureinpicture", () => {});
        video.addEventListener("leavepictureinpicture", () => {
          leavePIP();
        });
        video.addEventListener(
          "canplay",
          function () {
            this.play();
            enterPIP(stream, video);
          },
          { once: true }
        );
        document.body.appendChild(video);
      } catch (e) {
        alert(e);
      }
    },
  },
};
