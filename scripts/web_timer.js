export default {
  icon: '<i class="fa-solid fa-hourglass-half fa-lg fa-spin-pulse"></i>',
  name: {
    en: "Web timer",
    vi: "Thời gian lướt web",
  },
  description: {
    en: "Keep track of how you spend your time on the web.<br/><h3>CLICK TO OPEN HISTORY.</h3>",
    vi: "Lưu lại / Kiểm tra thời gian lướt web của bạn cho từng trang web.<br/><h3>BẤM ĐỂ XEM LỊCH SỬ.</h3>",
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
      const INTERVAL_SAVE = 5;
      const IDLE_TIME = 5;

      const invisible = "\u200b";
      let originalTitle = document.title;
      let titleCache = originalTitle;

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

      // variables
      let savedTimerValue = 0,
        currentTimerValue = 0,
        focusTimerValue = 0;

      // get saved timer
      getTodayTimer().then((todayTimer) => {
        savedTimerValue = todayTimer.value;
      });

      let lastActive;
      updateLastActive();
      window.addEventListener("load", updateLastActive);

      setInterval(async () => {
        let idle = await isIdle();

        if (idle) {
          UfsGlobal.DOM.notify({
            msg: "Useful script - Webtimer - IDLE state",
            duration: 2000,
          });
        }

        if (!(document.hidden || idle)) {
          focusTimerValue++;
          currentTimerValue = savedTimerValue + focusTimerValue;
          makeTitle();
        }
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

      ["mousemove", "mousedown", "keydown", "touchstart", "wheel"].forEach(
        (event) => {
          document.addEventListener(event, updateLastActive);
        }
      );
      document.addEventListener("visibilitychange", () => {
        if (!document.hidden) {
          updateLastActive();
        }
      });

      // functions
      function updateLastActive() {
        lastActive = performance.now();
      }
      async function isIdle() {
        // check if no audio or video is playing in website
        let allMedia = document.querySelectorAll("video, audio");
        for (let media of allMedia) {
          if (!media.paused) return false;
        }

        return new Date() - lastActive > IDLE_TIME * 1000;

        if (IDLE_TIME > 0) {
          let state = await UfsGlobal.Extension.runInBackground(
            "chrome.idle.queryState",
            [IDLE_TIME]
          );
          return state !== "active";
        }
        return false;
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

      let windowLoaded = false;
      window.addEventListener("load", () => {
        windowLoaded = true;
        originalTitle = document.title;
      });
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
