export default {
  icon: '<i class="fa-solid fa-hourglass-half fa-lg"></i>',
  name: {
    en: "Web timer",
    vi: "Thời gian lướt web",
  },
  description: {
    en: "Keep track of how you spend your time on the web.",
    vi: "Lưu lại / Kiểm tra thời gian lướt web của bạn cho từng trang web.",
  },

  changeLogs: {
    ["2024-05-10"]: "init",
  },

  contentScript: {
    onDocumentIdle: async () => {
      let hostname = location.hostname;

      let { web_timer } = await chrome.storage.local.get(["web_timer"]);
      if (!(typeof web_timer === "object")) web_timer = {};

      let currentTimer = web_timer?.[hostname] || 0;

      function secondsToTime(secs) {
        let hours = Math.floor(secs / 3600);
        let minutes = Math.floor((secs - hours * 3600) / 60);
        let seconds = secs - hours * 3600 - minutes * 60;
        let time = "";
        if (hours > 0) time += hours < 10 ? `0${hours}:` : `${hours}:`;
        time += minutes < 10 ? `0${minutes}:` : `${minutes}:`;
        time += seconds < 10 ? `0${seconds}` : `${seconds}`;
        return time;
      }

      function saveTimer() {
        web_timer[hostname] = currentTimer;
        chrome.storage.local.set({ web_timer });
      }

      let running = true;
      let timer = setInterval(() => {
        // check focus
        if (running) {
          currentTimer++;
          document.title = `⏳ ${secondsToTime(currentTimer)}`;
          saveTimer();
        }
        console.log(running);
      }, 1000);

      window.addEventListener("scroll", () => (running = false));
      window.addEventListener("blur", () => (running = false));
      window.addEventListener("focus", () => (running = true));
      window.addEventListener("beforeunload", () => saveTimer);
    },

    onClick: () => {},
  },
};
