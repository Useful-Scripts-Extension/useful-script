export default {
  icon: "https://lh3.googleusercontent.com/cvfpnTKw3B67DtM1ZpJG2PNAIjP6hVMOyYy403X4FMkOuStgG1y4cjCn21vmTnnsip1dTZSVsWBA9IxutGuA3dVDWhg=w128-h128-e365-rj-sc0x00ffffff",
  name: {
    en: "PIP full website",
    vi: "PIP toàn website",
  },
  description: {
    en: "Picture in picture mode for full website",
    vi: "Picture in picture: Xem toàn bộ website (thay vì chỉ video) trong của sổ nổi",
    img: "",
  },

  changeLogs: {
    1.66: {
      "2024-04-25": "init",
    },
  },

  onClickContentScript: async () => {
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
      document.exitPictureInPicture();
      window.ufs_pip_fullWebsite.isPIP = false;
      window.ufs_pip_fullWebsite.video?.remove?.();
      window.ufs_pip_fullWebsite.stream?.getVideoTracks?.().forEach((track) => {
        track.stop();
      });
      window.ufs_pip_fullWebsite.stream = null;
    }

    try {
      if (window.ufs_pip_fullWebsite.isPIP) {
        leavePIP();
        return;
      }

      const tab = await UfsGlobal.Extension.runInBackground(
        "utils.getCurrentTab"
      );

      const streamId = await UfsGlobal.Extension.runInBackground(
        "chrome.tabCapture.getMediaStreamId",
        [
          {
            targetTabId: tab.id,
            consumerTabId: tab.id,
          },
        ]
      );

      navigator.webkitGetUserMedia(
        {
          audio: false,
          video: {
            mandatory: {
              chromeMediaSource: "tab", // The media source must be 'tab' here.
              chromeMediaSourceId: streamId,
              minWidth: 50,
              minHeight: 50,
              // maxWidth: 1920,
              // maxHeight: 1080,
              minFrameRate: 10,
              maxFrameRate: 60,
            },
          },
        },
        function (stream) {
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
        },
        function (error) {
          alert("ERROR: " + error);
          console.log(error);
        }
      );
    } catch (e) {
      alert(e);
    }
  },
};
