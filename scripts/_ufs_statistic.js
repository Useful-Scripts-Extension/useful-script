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

  whiteList: ["https://useful-script-statistic.glitch.me/log*"],

  onDocumentEnd: async () => {
    javascript: (function () {
      UfsGlobal.DOM.injectScriptSrc(
        "https://cdn.jsdelivr.net/npm/chart.js",
        (success, fail) => {
          if (fail) {
            alert("ERROR: " + fail);
            return;
          }

          let logData = document.body.innerText.split("\n");

          // Function to extract time from log data
          function extractTime(log) {
            let lastColon = log.lastIndexOf(":");
            let time = log.substring(0, lastColon);
            return new Date(time);
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

          // ======================== Per script name ========================
          const scriptNameCount = new Map();
          logData.forEach((log) => {
            let lastColon = log.lastIndexOf(":");
            let lastArrow = log.lastIndexOf("->");
            let scriptName = log.substring(lastColon + 1, lastArrow - 1);
            scriptNameCount.set(
              scriptName,
              (scriptNameCount.get(scriptName) || 0) + 1
            );
          });

          // sort by values
          const scriptNameCountSorted = new Map(
            [...scriptNameCount.entries()].sort((a, b) => b[1] - a[1])
          );

          const canvas2 = document.createElement("canvas");
          canvas2.style.cssText = "max-height: 500px;";
          const ctx2 = canvas2.getContext("2d");
          const scriptNameChart = new Chart(ctx2, {
            type: "doughnut",
            data: {
              labels: Array.from(scriptNameCountSorted.keys()),
              datasets: [
                {
                  data: Array.from(scriptNameCountSorted.values()),
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
                  text: `Number of logs per script name (${scriptNameCount.size} scripts)`,
                },
              },
              responsive: true,
            },
          });

          // ======================== Per script name Per hour ========================
          //   Stacked Bar Chart for each script
          const scriptNamePerHour_dataset = Array.from(
            scriptNameCount.keys()
          ).map((scriptName) => {
            const data = Array(24).fill(0);
            logData.forEach((log) => {
              let lastColon = log.lastIndexOf(":");
              let lastArrow = log.lastIndexOf("->");
              let scriptName_log = log.substring(lastColon + 1, lastArrow - 1);
              if (scriptName_log === scriptName) {
                let hour = extractTime(log).getHours();
                data[hour]++;
              }
            });
            return {
              label: scriptName,
              data,
              backgroundColor: randColor(),
              stack: "combined",
              type: "bar",
            };
          });

          const canvas = document.createElement("canvas");
          canvas.style.cssText = "max-height: 500px;";
          const ctx3 = canvas.getContext("2d");
          const scriptNamePerHourChart = new Chart(ctx3, {
            type: "line",
            data: {
              labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
              datasets: scriptNamePerHour_dataset.concat({
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

          // ======================== Average section ========================
          const h1 = document.createElement("h1");
          h1.textContent = `${logData.length} logs,
          ${scriptNameCount.size} scripts used
          (~${~~(logData.length / new Date().getHours())} scripts/hour)`;

          // ======================== Append Charts ========================
          document.body.prepend(h1, canvas, canvas2);
        }
      );
    })();
  },
};
