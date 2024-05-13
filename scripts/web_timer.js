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
    onDocumentStart: async () => {
      const INTERVAL_UPDATE = 1;
      const INTERVAL_SAVE = 30;
      const IDLE_TIME = 30;
      const SHOW_OVERLAY = true;

      const invisible = "\u200b";
      let originalTitle = "";
      let titleCache = originalTitle;
      let windowLoaded = false;
      let needUpdateLastActive = true;
      let savedTimerValue = 0,
        currentTimerValue = 0,
        focusTimerValue = 0;

      window.addEventListener("load", () => {
        windowLoaded = true;
        originalTitle = document.title || location.hostname;
      });

      // listen title change
      UfsGlobal.DOM.waitForElements("title").then(function (element) {
        new MutationObserver(function (mutations) {
          let title = mutations[0].target.textContent;
          if (title === titleCache) return;
          if (title?.includes(invisible)) {
            originalTitle = title?.split(invisible)?.[1] || originalTitle;
          } else {
            originalTitle = title;
          }
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

      let lastActive = 0;
      window.addEventListener("load", updateLastActive);

      const overlay = document.createElement("div");
      overlay.style.cssText = `
        position: fixed;
        top: -100vh;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 2147483647;
        transition: top 0.5s ease;
      `;
      (document.body || document.documentElement).appendChild(overlay);
      ["mouseenter", "mousemove", "touchstart"].forEach((event) => {
        overlay.addEventListener(event, updateLastActive);
      });

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
          if (SHOW_OVERLAY && !document.hidden) overlay.style.top = "0";
        } else {
          overlay.style.top = "-100vh";
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

      [
        "mouseout",
        "mouseenter",
        "mousemove",
        "mousedown",
        "mouseover",
        "mouseleave",

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
        "focusin",
        "focusout",
      ].forEach((event) => {
        window.addEventListener(event, updateLastActive);
      });
      document.addEventListener("visibilitychange", () => {
        if (!document.hidden) {
          updateLastActive();
        }
      });

      // functions
      function updateLastActive() {
        needUpdateLastActive = true;
      }

      async function getIdleState() {
        // if not enough time passed since last active? => not idle
        let timePassed = ~~(performance.now() - lastActive);
        if (timePassed < IDLE_TIME * 1000)
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
          reason: "no active events in " + IDLE_TIME + " secs",
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
