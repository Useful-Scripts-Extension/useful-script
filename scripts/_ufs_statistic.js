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
    "2024-04-23": "init",
    "2024-04-27": "scripts by uid + date picker",
  },

  whiteList: ["https://useful-script-statistic.glitch.me/log*"],

  onDocumentEnd: async () => {
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
        "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js"
      );

      let logData = logs.map((_) => _.replace(/-\d+/, ""));

      // Function to extract time from log data
      function extractTime(log) {
        let lastColon = log.lastIndexOf(":");
        let time = log.substring(0, lastColon);
        return new Date(time);
      }

      function extractEventName(log) {
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
        let name = extractEventName(log);
        eventNameCount.set(name, (eventNameCount.get(name) || 0) + 1);
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
        (eventName) => {
          const data = Array(24).fill(0);
          logData.forEach((log) => {
            let eventName_log = extractEventName(log);
            if (eventName_log === eventName) {
              let hour = extractTime(log).getHours();
              data[hour]++;
            }
          });
          return {
            label: eventName + " (" + eventNameCount.get(eventName) + ")",
            data,
            backgroundColor: randColor(),
            stack: "combined",
            type: "bar",
          };
        }
      );

      const canvas_eventPerHour = document.createElement("canvas");
      const ctx3 = canvas_eventPerHour.getContext("2d");
      const eventNamePerHourChart = new Chart(ctx3, {
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

      const toggleShowHideAllBtn = document.createElement("button");
      toggleShowHideAllBtn.textContent = "Show/hide all";
      toggleShowHideAllBtn.onclick = function () {
        eventNamePerHourChart.data.datasets.forEach(function (ds) {
          ds.hidden = !ds.hidden;
        });
        eventNamePerHourChart.update();
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

      // ======================== show scripts only ========================
      function isScript(log) {
        return !(
          log.includes("ufs-INSTALLED") ||
          log.includes("OPEN-") ||
          log.includes("CLICK_") ||
          log.includes("-INFO") ||
          log.includes("-FAVORITE") ||
          log.includes("-VIEW-SOURCE")
        );
      }

      let scriptOnlyState = false;
      const scriptOnlyToggle = document.createElement("button");
      scriptOnlyToggle.textContent = "Show scripts only (OFF)";
      scriptOnlyToggle.onclick = function () {
        scriptOnlyState = !scriptOnlyState;
        scriptOnlyToggle.textContent = scriptOnlyState
          ? "Show scripts only (ON)"
          : "Show scripts only (OFF)";
        if (scriptOnlyState) {
          scriptOnlyToggle.classList.add("btn-active");
        } else {
          scriptOnlyToggle.classList.remove("btn-active");
        }

        all_li.forEach(({ li, log }) => {
          if (scriptOnlyState && !isScript(log)) {
            li.classList.add("not-script");
          } else {
            li.classList.remove("not-script");
          }
        });
      };

      // ======================== Average section ========================
      const scriptsUsed = new Map();
      logData.forEach((log) => {
        if (isScript(log)) {
          let scriptName = extractEventName(log);
          scriptsUsed.set(scriptName, (scriptsUsed.get(scriptName) || 0) + 1);
        }
      });

      let scriptUsedTotalCount = scriptsUsed
        .values()
        .reduce((a, b) => a + b, 0);

      const h1 = document.createElement("h1");
      let hour = new Date().getHours() + 1;
      let _logsPerHour = ~~(logData.length / hour);
      let _eventsPerHour = ~~(eventNameCount.size / hour);
      let _scriptsPerHour = ~~(scriptUsedTotalCount / hour);
      h1.innerHTML = `${logData.length} logs (~${_logsPerHour} logs/hour)<br/>
          ${eventNameCount.size} unique events<br/><br/>
          ${scriptUsedTotalCount} scripts used (~${_scriptsPerHour} scripts/hour)<br/>
          ${scriptsUsed.size} unique scripts`;

      // ======================== Append Charts ========================
      container.prepend(
        h1,
        toggleShowHideAllBtn,
        canvas_eventPerHour,
        canvas_events,
        canvas_uid,
        scriptOnlyToggle
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

    function dateToString(date) {
      let day = date.getDate().toString().padStart(2, "0");
      let month = (date.getMonth() + 1).toString().padStart(2, "0");
      let year = date.getFullYear();
      let dateString = `${year}-${month}-${day}`;
      return dateString;
    }

    function getPath(date) {
      return `/log/${dateToString(date)}`;
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
