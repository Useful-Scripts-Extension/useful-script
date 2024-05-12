import { t } from "../popup/helpers/lang.js";

const backBtn = document.querySelector("#back");
const chartContainer = document.querySelector("#chart");
const controllerContainer = document.querySelector("#controller");
const preDateBtn = document.querySelector("#prev-date");
const nextDateBtn = document.querySelector("#next-date");
const curDateSpan = document.querySelector("#current-date");
const inputDate = document.querySelector("#date-picker");
const guide = document.querySelector("#guide");
const dailyAverageBtn = document.querySelector("#daily-average");
const allTimeBtn = document.querySelector("#all-time");

const dataContainer = document.querySelector("#timer-data");

init();

let web_timer, curDate;
const FormatCache = new Map();

chrome.storage.local.get("web_timer", function (result) {
  web_timer = result.web_timer;
  console.log(web_timer);

  // if (!web_timer || !Object.keys(web_timer).length) {
  guide.innerHTML = t({
    vi: "Không có dữ liệu<br/>Vui lòng bật chức năng<br/>Sau đó tải lại các trang web để bắt đầu quá trình đếm.",
    en: "No data<br/>Please enable this script<br/>Then reload all your websites to start the timer.",
  });
  // }

  showData(new Date());
});

function init() {
  backBtn.addEventListener("click", () => {
    window.history.back();
  });

  preDateBtn.addEventListener("click", () => {
    let preDate = new Date(curDate);
    preDate.setDate(preDate.getDate() - 1);
    showData(preDate);
  });

  nextDateBtn.addEventListener("click", () => {
    let nextDate = new Date(curDate);
    nextDate.setDate(nextDate.getDate() + 1);
    showData(nextDate);
  });

  curDateSpan.addEventListener("click", () => {
    inputDate.showPicker();
  });

  inputDate.addEventListener("change", (e) => {
    let date = new Date(e.target.value);
    showData(date);
  });

  dailyAverageBtn.innerHTML = t({ vi: "Trung bình", en: "Daily Average" });
  dailyAverageBtn.addEventListener("click", () => {
    showData("daily-average");
  });

  allTimeBtn.innerHTML = t({ vi: "Tất cả", en: "All Time" });
  allTimeBtn.addEventListener("click", () => {
    showData("all-time");
  });
}

function showData(type) {
  const { chartData, allData } = getData(type) || {};
  if (!allData?.length) return;

  // draw chart
  let chart = Donut(280, chartData, 50, 2);
  chartContainer.innerHTML = "";
  chartContainer.appendChild(chart);

  // draw controller
  dataContainer.innerHTML = "";
  allData.forEach((d) => {
    let row = document.createElement("div");
    row.classList.add("row");
    row.setAttribute("ufs-website", d.website);
    row.innerHTML = `
      <div>
        <div class="color" style="background-color: ${d.color}"></div>
        <div class="label" >${d.website}</div>
      </div>
      <div>
        <div class="percentage">${d.percentage} %</div>
        <div class="timer">
          ${splitHidden(formatSeconds(d.value, true))}
        </div>
      </div>
    `;
    row.addEventListener("mouseover", () => {
      document.querySelector("g.active")?.classList.remove("active");
      document
        .querySelector("g[ufs-website='" + d.website + "']")
        ?.dispatchEvent(new Event("mouseover", { bubbles: true }));
    });
    row.addEventListener("click", () => {});
    dataContainer.appendChild(row);
  });

  // total row
  let totalTime = allData.reduce((acc, curr) => acc + curr.value, 0);
  let totalRow = document.createElement("div");
  totalRow.classList.add("row", "total");
  totalRow.innerHTML = `
    <div>
      <div class="label">${t({ vi: "Tổng", en: "Total" })}</div>
    </div>
    <div>
      <div class="percentage">100.00 %</div>
      <div class="timer">${splitHidden(formatSeconds(totalTime, true))}</div>
    </div>
  `;
  dataContainer.appendChild(totalRow);
}

function creatWebsiteeDetail(website, allData) {}

function getData(type) {
  let allData = [],
    chartData = [];

  if (type instanceof Date) {
    let date = type;
    let dateKey = formatDate(date);
    if (!web_timer[dateKey]) {
      inputDate.value = curDate;
      alert(
        t({
          vi: "không có dữ liệu cho ngày " + formatDate(date),
          en: "No data for this date " + formatDate(date),
        })
      );
      return null;
    }

    curDate = date;
    inputDate.value = dateKey;
    curDateSpan.innerHTML = formatDate(date);

    allData = Object.entries(web_timer[dateKey]).filter((_) => _[1] > 0);

    guide.innerText = t({
      vi: `Dữ liệu ngày ${dateKey} (${allData.length} websites)`,
      en: `Data for ${dateKey} (${allData.length} websites)`,
    });
  }

  let web = {},
    oldestDate = formatDate(new Date()),
    totalDays = 0;

  if (type === "all-time" || type === "daily-average") {
    for (let date in web_timer) {
      totalDays++;
      if (date < oldestDate) oldestDate = date;
      for (let website in web_timer[date]) {
        if (!web[website]) web[website] = 0;
        if (web_timer[date][website]) {
          web[website] += web_timer[date][website];
        }
      }
    }
    allData = Object.entries(web);

    guide.innerText = t({
      vi: `Dữ liệu tổng hợp từ ${oldestDate} (${totalDays} ngày)`,
      en: `Aggregate data since ${oldestDate} (${totalDays} days)`,
    });
  }

  if (type === "daily-average") {
    allData = [];
    for (let website in web) {
      let average = web[website] / totalDays;
      if (average > 0) allData.push([website, average]);
    }

    guide.innerText = t({
      vi: `Trung bình hằng ngày từ ${oldestDate} (${totalDays} ngày)`,
      en: `Daily averages since ${oldestDate} (${totalDays} days)`,
    });
  }

  if (allData.length || chartData.length) {
    let totalTime = allData.reduce((acc, curr) => acc + curr[1], 0);

    allData = allData
      .sort((a, b) => b[1] - a[1])
      .map(([key, value], i) => {
        let percentage = ((value / totalTime) * 100).toFixed(2);
        return {
          website: key,
          percentage,
          value,
        };
      });

    let lastI = allData.findIndex((d) => d.percentage < 1) - 1;
    let indexToSlice = lastI > 0 ? Math.min(lastI, 16) : 16;

    chartData = allData.slice(0, indexToSlice);
    if (allData.length > indexToSlice) {
      let totalOther = allData
        .slice(indexToSlice - 1)
        .reduce((acc, curr) => acc + curr.value, 0);

      chartData.push({
        website: t({ vi: "khác", en: "other" }),
        value: totalOther,
        color: "gray",
        percentage: ((totalOther / totalTime) * 100).toFixed(2),
      });
    }

    // inject color
    let percent = 0;
    for (let i = 0; i < allData.length; i++) {
      if (i >= indexToSlice) allData[i].color = "gray";
      else {
        allData[i].color = getHSL(i, indexToSlice);
        percent += Number(allData[i].percentage);
      }
    }
  }

  return { chartData, allData };
}

function getHSL(e, t) {
  let r = e * (300 / (t = t || 1));
  return "hsl(" + r + ", 100%, 50%)";
}

function splitHidden(timeString) {
  if (!(typeof timeString === "string")) return timeString;
  let firstNumberIndex = timeString.split("").findIndex((c) => c > 0 && c <= 9);
  if (firstNumberIndex === -1)
    return `<span class="hidden">${timeString}</span>`;

  let hiddenPart = timeString.slice(0, firstNumberIndex);
  let hightlightPart = timeString.slice(firstNumberIndex);
  return `<span class="hidden">${hiddenPart}</span>${hightlightPart}`;
}

function formatSeconds(sec, keepAll = false) {
  if (FormatCache.has(sec)) return FormatCache.get(sec);
  let days = Math.floor(sec / 86400);
  let hours = Math.floor((sec % 86400) / 3600);
  let minutes = Math.floor((sec % 3600) / 60);
  let seconds = Math.floor(sec % 60);

  let result = "";
  let arr = [
    [days, "d"],
    [hours, "h"],
    [minutes, "m"],
    [seconds, "s"],
  ];
  arr.forEach(([value, unit], index) => {
    if (value > 0 || keepAll) {
      if (value < 10) value = "0" + value;
      result += `${value}${unit}`;
      if (index < arr.length - 1) result += " ";
    }
  });
  FormatCache.set(sec, result);
  return result;
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

function Donut(diameter, data, strokeWidth = 50, gap = 0, wedgeWidth = 4) {
  const decimals = 4;
  const total = data.reduce((acc, curr) => acc + curr.value, 0);
  const arcs = [];
  let radius = diameter / 2;
  let svgSize = radius * 2 + (wedgeWidth + 15) * 2;
  let startAngle = 0;
  let gapInAngle = 2 * Math.atan(gap / (2 * radius)) * (180 / Math.PI);
  let cx = svgSize / 2;
  let cy = svgSize / 2;
  let r = radius - strokeWidth / 2;

  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    const percentage = ((item.value / total) * 100).toFixed(2);
    const endAngle = startAngle + (360 / 100) * percentage - gapInAngle / 2;
    const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

    let startPoint = calculatePoint(cx, cy, r, endAngle);
    let endPoint = calculatePoint(cx, cy, r, startAngle);
    let sx = startPoint.x.toFixed(decimals);
    let sy = startPoint.y.toFixed(decimals);
    let ex = endPoint.x.toFixed(decimals);
    let ey = endPoint.y.toFixed(decimals);
    const arcPath = `M${sx},${sy} A${r},${r} 0 ${largeArcFlag},0 ${ex},${ey}`;

    // another line beyond the edge of arc
    let outterRadius = r + 25 + wedgeWidth;
    startPoint = calculatePoint(cx, cy, outterRadius, endAngle);
    endPoint = calculatePoint(cx, cy, outterRadius, startAngle);
    sx = startPoint.x.toFixed(decimals);
    sy = startPoint.y.toFixed(decimals);
    ex = endPoint.x.toFixed(decimals);
    ey = endPoint.y.toFixed(decimals);
    const outerArcPath = `M${sx},${sy} A${outterRadius},${outterRadius} 0 ${largeArcFlag},0 ${ex},${ey}`;

    const arc = {
      index: i,
      value: item.value,
      website: item.website,
      color: item.color,
      percentage: item.percentage,
      d: arcPath,
      d2: outerArcPath,
    };

    arcs.push(arc);
    startAngle = endAngle + gapInAngle / 2;
  }

  let svg = `<svg viewBox="0 0 ${svgSize} ${svgSize}" width="${svgSize}" height="${svgSize}" xmlns="http://www.w3.org/2000/svg">
  <foreignObject x="0" y="0" width="${svgSize}" height="${svgSize}">
      <body>
        <div class="center">
          <div class="percentage"></div>
          <div class="timer"></div>
          <div class="name"></div>
        </div>
      </body>
    </foreignObject>

    ${arcs
      .map((path, index) => {
        return `<g ufs-website="${path.website}" ufs-timer="${path.value}" ufs-percentage="${path.percentage}">
          <path d="${path.d}" stroke="${path.color}" fill="none" stroke-width="${strokeWidth}" />
          <path d="${path.d2}" stroke="${path.color}" fill="none" stroke-width="${wedgeWidth}" class="wedge" />
        </g>`;
      })
      .join("")}
  </svg>`;

  let div = document.createElement("div");
  div.innerHTML = svg;

  let percentageDiv = div.querySelector(".percentage");
  let timerDiv = div.querySelector(".timer");
  let nameDiv = div.querySelector(".name");
  let allG = div.querySelectorAll("g");
  allG.forEach((g) => {
    g.addEventListener("mouseover", (e) => {
      allG.forEach((gg) => {
        gg.classList.toggle("active", false);
      });
      g.classList.toggle("active", true);

      let percentage = g.getAttribute("ufs-percentage");
      let name = g.getAttribute("ufs-website");
      let timer = g.getAttribute("ufs-timer");
      percentageDiv.innerHTML = `${percentage} %`;
      timerDiv.innerHTML = formatSeconds(timer);
      nameDiv.innerHTML = name;

      document.querySelector(".row.active")?.classList.toggle("active", false);
      document
        .querySelector(".row[ufs-website='" + name + "']")
        ?.classList.toggle("active", true);
    });

    // g.addEventListener("click", (e) => {
    //   let website = g.getAttribute("ufs-website");
    //   window.open("https://" + website, "_blank");
    // });
  });

  allG[0]?.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));

  return div;
}

function calculatePoint(cx, cy, radius, degrees) {
  const radians = ((degrees - 90) * Math.PI) / 180.0;
  return {
    x: cx + radius * Math.cos(radians),
    y: cy + radius * Math.sin(radians),
  };
}

function BarDateRange() {}

function BarWeek() {}
