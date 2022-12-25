export default {
  icon: "https://lh3.googleusercontent.com/OS9P4SJOFAg8lhCyaRTJ7y4ADF0TGpqFF904BcpCtdBjJIDBbNb_J8PpgoJ9QvariiG_RzgH8fCSSY_kQu-chQQ0Aw=w128-h128-e365-rj-sc0x00ffffff",
  name: {
    en: "Youtube nonstop",
    vi: "Youtube nonstop",
  },
  description: {
    en: 'Kiss the annoying "Video paused. Continue watching?" confirmation goodbye!',
    vi: "Phát youtube không còn bị làm phiền bởi popup 'Video đã tạm dừng. Bạn có muốn xem tiếp?' của youtube.",
  },
    whiteList: ["*://music.youtube.com/*", "*://www.youtube.com/*"],

  onClick: function () {
    // source code from: https://chrome.google.com/webstore/detail/youtube-nonstop/nlkaejimjacpillmajjnopmpbkbnocid

    try {
      const tag = "[Youtube NonStop]";
      const isYoutubeMusic = window.location.hostname === "music.youtube.com";

      const popupEventNodename = isYoutubeMusic
        ? "YTMUSIC-YOU-THERE-RENDERER"
        : "YT-CONFIRM-DIALOG-RENDERER";

      const MutationObserver =
        window.MutationObserver || window.WebKitMutationObserver;
      let appObserver = null;
      const appName = isYoutubeMusic ? "ytmusic-app" : "ytd-app";
      const popupContainer = isYoutubeMusic
        ? "ytmusic-popup-container"
        : "ytd-popup-container";

      let pauseRequested = false;
      let pauseRequestedTimeout;
      const pauseRequestedTimeoutMillis = 5000;
      const idleTimeoutMillis = 5000;
      let lastInteractionTime = new Date().getTime();

      let videoElement = null;

      function log(message) {
        console.log(`${tag}[${getTimestamp()}] ${message}`);
      }

      function debug(message) {
        console.debug(`${tag}[${getTimestamp()}] ${message}`);
      }

      function asDoubleDigit(value) {
        return value < 10 ? "0" + value : value;
      }

      function getTimestamp() {
        let dt = new Date();
        let time =
          asDoubleDigit(dt.getHours()) +
          ":" +
          asDoubleDigit(dt.getMinutes()) +
          ":" +
          asDoubleDigit(dt.getSeconds());
        return time;
      }

      function isIdle() {
        return getIdleTime() >= idleTimeoutMillis;
      }

      function getIdleTime() {
        return new Date().getTime() - lastInteractionTime;
      }

      function listenForMediaKeys() {
        if (navigator.mediaSession === undefined) {
          log(
            "Your browser doesn't seem to support navigator.mediaSession yet :/"
          );
          return;
        }
        debug('Listening to "pause" media key...');
        navigator.mediaSession.setActionHandler("pause", () => {
          debug("Paused due to [media key pause]");
          pauseVideo();
        });
        navigator.mediaSession.yns_setActionHandler =
          navigator.mediaSession.setActionHandler;
        navigator.mediaSession.setActionHandler = (action, fn) => {
          if (action === "pause") {
            debug("Blocked attempt to override media key 'pause' action");
            return;
          }
          navigator.mediaSession.yns_setActionHandler(action, fn);
        };
      }

      function listenForMouse() {
        const eventName = window.PointerEvent ? "pointer" : "mouse";
        debug(`Using ${eventName} events`);
        document.addEventListener(eventName + "down", (e) => {
          processInteraction(eventName + "down");
        });

        document.addEventListener(eventName + "up", (e) => {
          processInteraction(eventName + "up");
        });
      }

      function listenForKeyboard() {
        document.addEventListener("keydown", (e) => {
          processInteraction("keydown");
        });

        document.addEventListener("keyup", (e) => {
          processInteraction("keyup");
        });
      }

      function processInteraction(action) {
        if (pauseRequested) {
          debug(`Paused due to [${action}]`);
          pauseVideo();
          return;
        }
        lastInteractionTime = new Date().getTime();
      }

      function observeApp() {
        debug(`Observing ${appName}...`);
        appObserver = new MutationObserver((mutations, observer) => {
          overrideVideoPause();
        });

        appObserver.observe(document.querySelector(appName), {
          childList: true,
          subtree: true,
        });
      }

      function listenForPopupEvent() {
        debug("Listening for popup event...");
        document.addEventListener("yt-popup-opened", (e) => {
          if (isIdle() && e.detail.nodeName === popupEventNodename) {
            debug("[closing popup]");
            document.querySelector(popupContainer).handleClosePopupAction_();
            pauseVideo();
            videoElement.play();
          }
        });
      }

      function overrideVideoPause() {
        if (videoElement?.yns_pause !== undefined) return;
        if (document.querySelector("video") === null) return;

        videoElement = document.querySelector("video");
        listenForMediaKeys();
        debug("Overriding video pause...");
        videoElement.yns_pause = videoElement.pause;
        videoElement.pause = () => {
          debug("Video pause requested");
          if (!isIdle()) {
            debug("Paused due to [pause]");
            pauseVideo();
            return;
          }
          pauseRequested = true;
          setPauseRequestedTimeout();
        };
      }

      function setPauseRequestedTimeout(justClear = false) {
        clearTimeout(pauseRequestedTimeout);
        if (justClear) return;
        pauseRequestedTimeout = setTimeout(() => {
          pauseRequested = false;
        }, pauseRequestedTimeoutMillis);
      }

      function pauseVideo() {
        videoElement?.yns_pause();
        pauseRequested = false;
        setPauseRequestedTimeout(true);
      }

      listenForMouse();
      listenForKeyboard();

      listenForPopupEvent();
      observeApp();

      log(
        `Monitoring YouTube ${
          isYoutubeMusic ? "Music " : ""
        }for 'Confirm watching?' action...`
      );

      alert("Youtube nonstop ENABLED\n\nĐã bật Youtube nonstop.");
    } catch (e) {
      alert(
        "Cannot enable youtube nonstop\n\n Không thể bật youtube nonstop\n\n Lỗi/Error: " +
          JSON.stringify(e)
      );
    }
  },
};
