export default {
  icon: '<i class="fa-solid fa-hourglass-half fa-lg fa-spin-pulse"></i>',
  name: {
    en: "Web timer",
    vi: "Thời gian lướt web",
  },
  description: {
    en: "Keep track of how you spend your time on the web.<br/><h3>CLICK TO OPEN GRAPH.</h3>",
    vi: "Lưu lại / Kiểm tra thời gian lướt web của bạn cho từng trang web.<br/><h3>BẤM ĐỂ XEM BIỂU ĐỒ.</h3>",
    img: "/scripts/web_timer.png",
  },

  changeLogs: {
    ["2024-05-10"]: "init",
  },

  popupScript: {
    onClick: () => {
      window.open("/scripts/web_timer.html", "_self");
    },
  },

  contentScript: {
    onDocumentStart: async (details) => {
      const { frameId, frameType } = details;
      const isMainFrame = frameType === "outermost_frame";

      // track user events: mouse, keyboard, touch, ...
      let needUpdateLastActive = true;
      let updateLastActive = UfsGlobal.Utils.throttle(function (e, mainframe) {
        needUpdateLastActive = true;
      }, 1000 / 24);

      const allEvents = [
        // https://javascript.info/pointer-events
        "pointerover",
        "pointerenter",
        "pointerdown",
        "pointermove",
        "pointerup",
        "pointerleave",

        "click",
        "contextmenu",
        "touchstart",
        "touchmove",
        "touchend",

        "keydown",
        "keyup",
        "keypress",

        "wheel",
        "scroll",

        "blur",
        // "focusin",
        // "focusout",
        "focus",
      ];

      const updateLastActiveMsg = "ufs_web_timer_updateLastActive";
      const overlayId = "ufs-web-timer-overlay";
      allEvents.forEach((event) => {
        // main frame => update last active directly
        if (isMainFrame) {
          window.addEventListener(event, (e) => {
            if (e.target?.id == overlayId) return;
            updateLastActive?.(event, true);
          });
        } else {
          // iframes / subframes => postMessage to main frame
          window.addEventListener(
            event,
            UfsGlobal.Utils.throttle((e) => {
              // iframe's content_script cannot call window.top in mainframe's content_script
              // SO only solution is use postMessage
              window.top.postMessage(
                {
                  type: updateLastActiveMsg,
                  frameId: frameId,
                  event: event,
                },
                "*"
              );
            }, 1000 / 24)
          );
        }
      });

      const checkFocusMsg = "ufs_web_timer_checkFocus";
      if (!isMainFrame) {
        window.addEventListener("message", (e) => {
          if (e.data?.type === checkFocusMsg) {
            window.top.postMessage(
              {
                type: checkFocusMsg + "result",
                uuid: e.data?.uuid,
                focused: document.hasFocus(),
              },
              "*"
            );
          }
        });
      }

      // iframe / subframe stop here, all logic below are for main frame
      if (!isMainFrame) return;

      // ======================================================
      // ===================== MAIN FRAME =====================
      // ======================================================
      window.addEventListener(
        "message",
        (e) => {
          if (e.data?.type === updateLastActiveMsg) {
            updateLastActive(e.data?.event, false);
          }
        },
        false
      );

      // only check visibilityChange for outermost windows
      document.addEventListener("visibilitychange", () => {
        if (!document.hidden) {
          updateLastActive();
        }
      });

      const INTERVAL_UPDATE = 1;
      const INTERVAL_SAVE = 30;
      const IDLE_TIME = 60;
      const IDLE_TIME_IF_BLUR = 10;
      const SHOW_OVERLAY = true;

      const invisible = "\u200b";
      let originalTitle = "";
      let titleCache = originalTitle;
      let windowLoaded = false;
      let lastActive = 0;
      let savedTimerValue = 0,
        currentTimerValue = 0,
        focusTimerValue = 0;

      // listen title change
      UfsGlobal.DOM.waitForElements("title").then(function (element) {
        new MutationObserver(function (mutations) {
          let title = mutations[0].target.textContent;
          if (title === titleCache || !title) return;
          if (title?.includes(invisible)) {
            originalTitle = title?.split(invisible)?.[1] || originalTitle;
          } else {
            originalTitle = title;
          }
          makeTitle();
        }).observe(document.querySelector("title"), {
          subtree: true,
          characterData: true,
          childList: true,
        });
      });

      // get saved timer
      getTodayTimer().then((todayTimer) => {
        savedTimerValue = todayTimer.value;
      });

      const overlay = document.createElement("div");
      overlay.id = overlayId;
      overlay.style.cssText = `
        position: fixed;
        top: -100vh;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.35);
        z-index: 2147483646;
        transition: top 0.5s ease;
      `;
      ["mousemove", "click", "touchstart"].forEach((event) => {
        overlay.addEventListener(event, updateLastActive);
      });

      window.addEventListener("load", () => {
        windowLoaded = true;
        originalTitle = document.title || location.hostname;
        updateLastActive();
      });

      function setShowOverlay(show) {
        if (show) {
          if (!document.body.contains(overlay)) {
            // document.body.appendChild(overlay);
          }
          overlay.style.top = "0";
        } else {
          overlay.style.top = "-100vh";
        }
      }

      setInterval(async () => {
        if (needUpdateLastActive) {
          lastActive = performance.now();
          needUpdateLastActive = false;
        }

        let idleState = await getIdleState();

        if (idleState.isIdle) {
          UfsGlobal.DOM.notify({
            msg: `Useful script - Webtimer - IDLE state (${idleState.reason})`,
            duration: 2000,
          });
          if (SHOW_OVERLAY && !document.hidden) setShowOverlay(true);
        } else {
          setShowOverlay(false);
        }

        if (!document.hidden && !idleState.isIdle) {
          focusTimerValue++;
          currentTimerValue = savedTimerValue + focusTimerValue;
          makeTitle();
        }

        let now = new Date();
        let isMidnight =
          (now.getHours() === 23 &&
            now.getMinutes() === 59 &&
            now.getSeconds() === 59) ||
          (now.getHours() === 0 &&
            now.getMinutes() === 0 &&
            now.getSeconds() === 0);

        if (isMidnight) {
          saveTimer();
        }
      }, INTERVAL_UPDATE * 1000);

      setInterval(() => {
        saveTimer();
      }, INTERVAL_SAVE * 1000);

      window.addEventListener("beforeunload", saveTimer);

      // functions
      function isFocused() {
        // main frame focus
        if (document.hasFocus()) return true;

        // check iframes focus
        let iframes = Array.from(document.querySelectorAll("iframe"));
        if (!iframes.length) return false;

        return new Promise((resolve) => {
          let uuid = Math.random().toString(36);

          setTimeout(() => {
            window.removeEventListener("message", onReceiveMsg);
            resolve(false);
          }, 500);

          // post message to all iframes to check
          iframes.forEach((iframe) => {
            iframe.contentWindow.postMessage(
              {
                type: checkFocusMsg,
                uuid,
              },
              "*"
            );
          });
          // window.postMessage({ type: checkFocusMsg, uuid }, "*");
          window.addEventListener("message", onReceiveMsg);

          let msgReceivedCount = 0;
          function onReceiveMsg(e) {
            if (
              e.data?.type === checkFocusMsg + "result" &&
              e.data?.uuid === uuid
            ) {
              if (e.data?.focused === true) {
                window.removeEventListener("message", onReceiveMsg);
                resolve(true);
              }
              msgReceivedCount++;
              if (msgReceivedCount >= iframes.length) {
                window.removeEventListener("message", onReceiveMsg);
                resolve(false);
              }
            }
          }
        });
      }

      async function getIdleState() {
        let timeToCheck = (await isFocused()) ? IDLE_TIME : IDLE_TIME_IF_BLUR;

        // if not enough time passed since last active? => not idle
        let timePassed = ~~(performance.now() - lastActive);
        if (timePassed < timeToCheck * 1000)
          return {
            isIdle: false,
            reason: "not enough time passed since last active " + timePassed,
          };

        // if any video / audio playing? => not idle
        let allMedia = document.querySelectorAll("video, audio");
        for (let media of allMedia) {
          if (media.duration > 0 && !media.paused)
            return {
              isIdle: false,
              reason: "video / audio playing",
            };
        }

        // if this tab audible? => not idle
        let tabs = await UfsGlobal.Extension.runInBackground(
          "chrome.tabs.query",
          [
            {
              active: true,
              audible: true,
              url: location.href,
            },
          ]
        );
        let hasAudioPlaying = tabs?.length > 0;
        if (hasAudioPlaying)
          return {
            isIdle: false,
            reason: "this tab is audible ",
          };

        // if chrome.idle.queryState == active? => not idle
        let t = Math.max(15, IDLE_TIME);
        let state = await UfsGlobal.Extension.runInBackground(
          "chrome.idle.queryState",
          [t]
        );
        if (state != "active")
          return {
            isIdle: true,
            reason: "no system events in " + t + " secs",
          };

        return {
          isIdle: true,
          reason: "no active events in " + timeToCheck + " secs",
        };
      }

      async function saveTimer() {
        let { web_timer, host, today, value } = await getTodayTimer();
        let newValue = value + focusTimerValue;
        web_timer[today][host] = newValue;
        savedTimerValue = newValue;
        focusTimerValue = 0;
        await chrome.storage.local.set({ web_timer });
      }

      async function getTodayTimer() {
        let host = location.hostname;
        let today = getToday();
        let web_timer = (await chrome.storage.local.get(["web_timer"]))
          ?.web_timer;
        if (typeof web_timer !== "object") web_timer = {};
        if (typeof web_timer[today] !== "object") web_timer[today] = {};
        if (!web_timer[today][host]) web_timer[today][host] = 0;
        let value = Math.floor(web_timer[today][host]);

        return { web_timer, host, today, value };
      }

      function getToday() {
        return formatDate(new Date());
      }

      function formatDate(date) {
        let year = date.getFullYear();
        let month = padZero(date.getMonth() + 1);
        let day = padZero(date.getDate());
        return `${year}-${month}-${day}`;
      }

      function padZero(num) {
        return num.toString().padStart(2, "0");
      }

      function secondsToTime(secs) {
        let hours = Math.floor(secs / 3600);
        let minutes = Math.floor((secs - hours * 3600) / 60);
        let seconds = secs - hours * 3600 - minutes * 60;
        if (hours == 0) hours = "";
        else hours = `${hours}:`;
        if (hours == 0 && minutes == 0) minutes = "";
        else minutes = `${minutes}:`;
        if (hours == 0 && minutes == 0 && seconds == 0) seconds = "";
        return `${hours}${minutes}${seconds}`;
      }

      function makeTitle() {
        titleCache =
          `${secondsToTime(currentTimerValue)} ${invisible}` + originalTitle;
        if (windowLoaded) document.title = titleCache;
      }
    },
    runInAllFrames: true, // to able to tracking user events in all frames
  },
};

const backup = () => {
  // export data from https://chrome.google.com/webstore/detail/ppaojnbmmaigjmlpjaldnkgnklhicppk
  (async () => {
    chrome.storage.local.get(["domains"], (domains) => {
      let result = {};
      Object.entries(JSON.parse(domains.domains)).forEach(([website, data]) => {
        if (data.days) {
          for (let day in data.days) {
            if (!result[day]) result[day] = {};
            if (!result[day][website]) result[day][website] = 0;
            result[day][website] += data.days[day].seconds;
          }
        }
      });
      console.log(result);
    });
  })();

  (() => {
    chrome.storage.local.set({ web_timer });
  })();
};
