export default {
  icon: "/assets/icon32.png",
  name: {
    en: "Useful-scripts statistic",
    vi: "Useful-scripts statistic",
  },
  description: {
    en: "Dev only",
    vi: "Dev only",
  },

  changeLogs: {
    1.66: {
      "2024-04-23": "init",
      "2024-04-27": "scripts by uid + date picker",
    },
  },

  whiteList: ["https://useful-script-statistic.glitch.me/log*"],

  onDocumentEnd: async () => {
    if (document.body.innerText.length < 50) {
      for (let t of ["Waking up"]) {
        if (document.body.innerText.includes(t)) return;
      }
    }

    const logs = document.body.innerText
      .split("\n")
      .filter((_) => _)
      .map((_) => _.trim());
    if (!logs.length) return;

    let hasLog = logs[0] != "Log not found";

    const container = document.createElement("div");

    if (hasLog) {
      UfsGlobal.Extension.getURL("/scripts/_ufs_statistic.css").then(
        UfsGlobal.DOM.injectCssFile
      );

      // #region add search box
      document.body.innerText = "";

      const ol = document.createElement("ol");
      ol.setAttribute("reversed", true);
      document.body.appendChild(ol);
      const all_li = logs.map((log) => {
        let li = document.createElement("li");
        li.textContent = log;
        ol.appendChild(li);
        return { li, log };
      });

      const searchBox = document.createElement("input");
      searchBox.placeholder = "Search...";
      container.prepend(searchBox);
      searchBox.addEventListener("input", (e) => {
        let searchText = e.target.value;
        all_li.forEach(({ li, log }) => {
          if (
            !searchText ||
            log.toLowerCase().includes(searchText.toLowerCase())
          )
            li.classList.remove("hidden");
          else li.classList.add("hidden");
        });
      });

      // #endregion

      // #region add graphs
      await UfsGlobal.DOM.injectScriptSrcAsync(
        "https://cdn.jsdelivr.net/npm/chart.js"
      );

      let logData = logs.map((_) => _.replace(/-\d+/, ""));

      // Function to extract time from log data
      function extractTime(log) {
        let lastColon = log.lastIndexOf(":");
        let time = log.substring(0, lastColon);
        return new Date(time);
      }

      function extractScriptName(log) {
        let lastColon = log.lastIndexOf(":");
        let lastArrow = log.lastIndexOf("->");
        let scriptName = log.substring(lastColon + 1, lastArrow - 1).trim();
        return scriptName;
      }

      function randColor() {
        return "#" + Math.floor(Math.random() * 16777215).toString(16);
      }

      // Count logs per hour
      const logsPerHour = Array(24).fill(0);
      logData.forEach((log) => {
        const hour = extractTime(log).getHours();
        logsPerHour[hour]++;
      });

      // #region ======================== Per event name ========================
      const eventNameCount = new Map();
      logData.forEach((log) => {
        let scriptName = extractScriptName(log);
        eventNameCount.set(
          scriptName,
          (eventNameCount.get(scriptName) || 0) + 1
        );
      });

      // sort by values
      const eventNameCountSorted = new Map(
        [...eventNameCount.entries()].sort((a, b) => b[1] - a[1])
      );

      const canvas_events = document.createElement("canvas");
      const ctx2 = canvas_events.getContext("2d");
      const eventNameChart = new Chart(ctx2, {
        type: "doughnut",
        data: {
          labels: Array.from(eventNameCountSorted.keys()),
          datasets: [
            {
              data: Array.from(eventNameCountSorted.values()),
              backgroundColor: [
                "rgb(255, 99, 132)",
                "rgb(255, 159, 64)",
                "rgb(255, 205, 86)",
                "rgb(75, 192, 192)",
                "rgb(54, 162, 235)",
                "rgb(153, 102, 255)",
                "rgb(201, 203, 207)",
              ],
              hoverOffset: 4,
            },
          ],
        },
        options: {
          plugins: {
            legend: {
              display: false,
            },
            title: {
              display: true,
              text: `Number of logs per script name (${eventNameCount.size} scripts)`,
            },
          },
          responsive: true,
          onClick: (event, elements, chart) => {
            console.log(event, elements, chart);
            if (elements[0]) {
              const i = elements[0].index;
              let scriptId = chart.data.labels[i].split("(")[0];
              searchBox.value = scriptId;
              searchBox.dispatchEvent(new Event("input", { bubbles: true }));
            }
          },
        },
      });

      // #endregion

      // #region ======================== Event name Per hour ========================
      //   Stacked Bar Chart for each script
      const eventNamePerHour_dataset = Array.from(eventNameCount.keys()).map(
        (scriptName) => {
          const data = Array(24).fill(0);
          logData.forEach((log) => {
            let scriptName_log = extractScriptName(log);
            if (scriptName_log === scriptName) {
              let hour = extractTime(log).getHours();
              data[hour]++;
            }
          });
          return {
            label: scriptName + " (" + eventNameCount.get(scriptName) + ")",
            data,
            backgroundColor: randColor(),
            stack: "combined",
            type: "bar",
          };
        }
      );

      const canvas_eventPerHour = document.createElement("canvas");
      const ctx3 = canvas_eventPerHour.getContext("2d");
      const scriptNamePerHourChart = new Chart(ctx3, {
        type: "line",
        data: {
          labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
          datasets: eventNamePerHour_dataset.concat({
            label: "Total",
            data: logsPerHour,
            borderColor: "rgb(75, 192, 192)",
            type: "line",
            fill: false,
            tension: 0.5,
          }),
        },
        options: {
          datalabels: {
            display: true,
            formatter: (value) => value > 0,
          },
          responsive: true,
        },
      });

      const toggleBtn = document.createElement("button");
      toggleBtn.textContent = "Show/hide all";
      toggleBtn.onclick = function () {
        scriptNamePerHourChart.data.datasets.forEach(function (ds) {
          ds.hidden = !ds.hidden;
        });
        scriptNamePerHourChart.update();
      };
      // #endregion

      // #region ======================== Per uid ========================

      let logByUid = new Map();
      logs.forEach((log) => {
        let uid = /-(\d+)\)/.exec(log)?.[1];
        if (uid) logByUid.set(uid, (logByUid.get(uid) || 0) + 1);
      });

      // sort by values
      const logByUidSorted = new Map(
        [...logByUid.entries()].sort((a, b) => b[1] - a[1])
      );

      const canvas_uid = document.createElement("canvas");
      const ctx4 = canvas_uid.getContext("2d");
      const uidChart = new Chart(ctx4, {
        type: "doughnut",
        data: {
          labels: Array.from(logByUidSorted.keys()),
          datasets: [
            {
              data: Array.from(logByUidSorted.values()),
              backgroundColor: [
                "rgb(255, 99, 132)",
                "rgb(255, 159, 64)",
                "rgb(255, 205, 86)",
                "rgb(75, 192, 192)",
                "rgb(54, 162, 235)",
                "rgb(153, 102, 255)",
                "rgb(201, 203, 207)",
              ],
              hoverOffset: 4,
            },
          ],
        },
        options: {
          onClick: (event, elements, chart) => {
            console.log(event, elements, chart);
            if (elements[0]) {
              const i = elements[0].index;
              let uid = chart.data.labels[i];
              let value = chart.data.datasets[0].data[i];
              searchBox.value = uid;
              searchBox.dispatchEvent(new Event("input", { bubbles: true }));
            }
          },
          plugins: {
            legend: {
              display: false,
            },
            title: {
              display: true,
              text: `Scripts used by uid (${logByUid.size} uids)`,
            },
          },
          responsive: true,
        },
      });

      // #endregion

      // ======================== Average section ========================
      let scriptsUsed = new Map();
      Array.from(eventNameCount.keys()).forEach((key) => {
        if (
          key !== "ufs-INSTALLED" &&
          !key.startsWith("OPEN-") &&
          !key.startsWith("CLICK_") &&
          !key.includes("-INFO") &&
          !key.includes("-FAVORITE") &&
          !key.includes("-VIEW-SOURCE")
        ) {
          scriptsUsed.set(key, (scriptsUsed.get(key) || 0) + 1);
        } else {
          console.log(key);
        }
      });

      const h1 = document.createElement("h1");
      let hour = new Date().getHours() + 1;
      let _logsPerHour = ~~(logData.length / hour);
      let _eventsPerHour = ~~(eventNameCount.size / hour);
      let _scriptsPerHour = ~~(scriptsUsed.size / hour);
      h1.innerHTML = `${logData.length} logs (~${_logsPerHour} logs/hour)<br/>
          ${eventNameCount.size} events (~${_eventsPerHour} events/hour)<br/>
          ${scriptsUsed.size} scripts used (~${_scriptsPerHour} scripts/hour)`;

      // ======================== Append Charts ========================
      container.prepend(
        h1,
        toggleBtn,
        canvas_eventPerHour,
        canvas_events,
        canvas_uid
      );
      // #endregion
    }

    // #region add date selector
    function getCurrentLogDate() {
      let splitted = location.pathname.split("/");
      let last = splitted[splitted.length - 1];
      if (last === "" || last === "log") return new Date();
      return new Date(last);
    }

    function addDate(date, amount) {
      let newDate = new Date(date);
      newDate.setDate(newDate.getDate() + amount);
      return newDate;
    }

    function getPath(date) {
      return `/log/${date.toISOString().split("T")[0]}`;
    }

    const prevDayBtn = document.createElement("button");
    prevDayBtn.textContent = "< Prev day";
    prevDayBtn.onclick = function () {
      let date = getCurrentLogDate();
      let newDate = addDate(date, -1);
      location.pathname = getPath(newDate);
    };

    const todayBtn = document.createElement("button");
    todayBtn.textContent = "Today";
    todayBtn.onclick = function () {
      location.pathname = "/log";
    };

    const nextDayBtn = document.createElement("button");
    nextDayBtn.textContent = "Next day >";
    nextDayBtn.onclick = function () {
      let date = getCurrentLogDate();
      let newDate = addDate(date, 1);
      location.pathname = getPath(newDate);
    };

    const dateInput = document.createElement("input");
    dateInput.type = "date";
    dateInput.value = getCurrentLogDate().toISOString().split("T")[0];
    dateInput.onchange = function () {
      location.pathname = getPath(new Date(dateInput.value));
    };

    container.prepend(prevDayBtn, todayBtn, nextDayBtn, dateInput);

    document.body.prepend(container);

    // #endregion
  },
};
