import { UfsGlobal } from "./content-scripts/ufs_global.js";
import { getUserAvatarFromUid } from "./fb_GLOBAL.js";

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
    "2024-05-31": "trace uid",
  },

  whiteList: ["https://useful-script-statistic.glitch.me/log*"],

  pageScript: {
    onDocumentEnd,
  },
};

async function onDocumentEnd() {
  const logs = document.body.innerText
    .split("\n")
    .filter((_) => _)
    .map((_) => _.trim());

  if (!logs.length) return;

  let hasLog = logs[0] != "Log not found" && logs[0] != "Waking up";

  const allLogs = logs.map((log, i) => {
    const timeString = extractTime(log).replace(/\d+\/\d+\/\d+, /, "");
    const pm_am = timeString?.split(" ")[1];
    let hour = parseInt(timeString?.split(":")[0]) + (pm_am == "PM" ? 12 : 0);
    if (hour == 12 && pm_am == "AM") hour = 0;

    const data = {
      i,
      log,
      uid: extractUid(log),
      time: new Date(extractTime(log)),
      timeString,
      hour,
      eventName: extractEventName(log),
      version: extractVersion(log),
      totalCount: extractTotalCount(log),
      isScript: isScript(log),
      fbName: "",
      fbAvatar: "",
    };
    const eventNameWithoutVersion = data.eventName
      .replace("(" + data.version + ")", "")
      .trim();
    const version = padStr(data.version, 4, " ");
    if (version && eventNameWithoutVersion)
      data.logPretty = `${data.timeString} | ${version} | ${eventNameWithoutVersion} <i class="show-on-hover">${data.totalCount} ${data.uid}</i>`;
    else data.logPretty = data.log;
    return data;
  });

  console.log(allLogs);

  document.body.innerText = "";
  const container = document.createElement("div");

  if (hasLog) {
    UfsGlobal.Extension.getURL("/scripts/ufs_statistic.css").then(
      UfsGlobal.DOM.injectCssFile
    );
    UfsGlobal.DOM.injectCssFile(
      "https://cdn.jsdelivr.net/npm/ag-grid-community@32.2.2/styles/ag-grid.css",
      "ag-grid-css"
    );
    UfsGlobal.DOM.injectCssFile(
      "https://cdn.jsdelivr.net/npm/ag-grid-community@32.2.2/styles/ag-theme-quartz-dark.css",
      "ag-grid-theme-css"
    );
    await UfsGlobal.DOM.injectScriptSrcAsync(
      "https://cdn.jsdelivr.net/npm/ag-charts-community@9.0.0/dist/umd/ag-charts-community.js",
      () => {}
    );
    await UfsGlobal.DOM.injectScriptSrcAsync(
      "https://cdn.jsdelivr.net/npm/ag-grid-community/dist/ag-grid-community.min.js",
      () => {}
    );

    console.log(arguments);

    // #region data
    // Count logs per hour
    // const logsPerHour = Array(24).fill(0);
    // allLogs.forEach((data) => {
    //   const hour = data.time.getHours();
    //   logsPerHour[hour]++;
    // });

    const eventNameCount = new Map();
    allLogs.forEach((data) => {
      eventNameCount.set(
        data.eventName,
        (eventNameCount.get(data.eventName) || 0) + 1
      );
    });

    // sort by values
    const eventNameCountSorted = new Map(
      [...eventNameCount.entries()].sort((a, b) => b[1] - a[1])
    );

    // Stacked Bar Chart for each script
    const eventNamePerHour_dataset = Array.from(eventNameCount.keys()).map(
      (eventName) => {
        const data = Array(24).fill(0);
        allLogs.forEach((_) => {
          if (_.eventName === eventName) {
            let hour = _.time.getHours();
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

    let logByUid = new Map();
    allLogs.forEach((data) => {
      logByUid.set(data.uid, (logByUid.get(data.uid) || 0) + 1);
    });

    // sort by values
    const logByUidSorted = new Map(
      [...logByUid.entries()].sort((a, b) => b[1] - a[1])
    );
    const fbUsers = [...logByUid.entries()].filter(([key, value]) => {
      return isFbUid(key);
    });

    const scriptsUsed = new Map();
    allLogs.forEach((data) => {
      if (data.isScript) {
        let scriptName = data.eventName;
        scriptsUsed.set(scriptName, (scriptsUsed.get(scriptName) || 0) + 1);
      }
    });

    let scriptUsedTotalCount = scriptsUsed.values().reduce((a, b) => a + b, 0);
    let hour = new Date().getHours() + 1;
    let _logsPerHour = ~~(allLogs.length / hour);
    let _eventsPerHour = ~~(eventNameCount.size / hour);
    let _scriptsPerHour = ~~(scriptUsedTotalCount / hour);

    const allUid = allLogs
      .filter((log) => isFbUid(log?.uid))
      .map((log) => log.uid);

    // #endregion

    const h1 = document.createElement("h1");
    h1.innerHTML = `${allLogs.length} logs (~${_logsPerHour} logs/hour)<br/>
      ${eventNameCount.size} unique events<br/><br/>
      ${scriptUsedTotalCount} scripts used (~${_scriptsPerHour} scripts/hour)<br/>
      ${scriptsUsed.size} unique scripts<br/><br/>
      ${logByUid.size} unique users<br/>
      ${fbUsers.length} facebook users`;
    container.appendChild(h1);

    // #region chart
    const { AgCharts } = agCharts;
    const interpolation = { type: "smooth" };

    function createLogCountPerHour(data) {
      const logsCountPerHour = Array(24).fill(0);
      data.forEach((data) => {
        const hour = data.time.getHours();
        logsCountPerHour[hour]++;
      });
      return logsCountPerHour.map((_, i) => ({
        x: i + "",
        y: _,
      }));
    }

    const chartContainer = document.createElement("div");
    chartContainer.id = "ag-charts";
    chartContainer.classList.add("ag-theme-quartz-dark");
    container.appendChild(chartContainer);

    const chartOptions = {
      container: chartContainer,
      autoSize: true,
      title: {
        text: "Logs per hour",
      },
      data: createLogCountPerHour(allLogs),
      series: [
        {
          type: "bar",
          xKey: "x",
          yKey: "y",
          title: "Count",
          marker: {
            shape: "square",
          },
        },
      ],
      axes: [
        {
          type: "category",
          position: "bottom",
          title: {
            text: "Hour",
          },
        },
        {
          type: "number",
          position: "left",
          title: {
            text: "Count",
          },
        },
      ],
      legend: {
        enabled: false,
      },
    };

    const chart = AgCharts.create(chartOptions);

    // #endregion

    // #region table
    const div = document.createElement("div");
    div.id = "ag-grid";
    div.classList.add("ag-theme-quartz-dark");

    const gridApi = agGrid.createGrid(div, {
      enableCellTextSelection: true,
      suppressDragLeaveHidesColumns: true,
      rowData: allLogs,
      columnDefs: [
        {
          field: "i",
          headerName: "#",
          width: 60,
          filter: false,
        },
        {
          field: "timeString",
          // valueFormatter: (params) => params.value.toLocaleTimeString(),
          width: 120,
        },
        {
          field: "hour",
          // filter: "agNumberColumnFilter",
          width: 100,
        },
        { field: "version", width: 120 },
        { field: "uid" },
        {
          field: "fbName",
          cellRenderer: (params) => {
            if (params.data.fbName) {
              const a = document.createElement("a");
              a.href = `https://fb.com/${params.data.uid}`;
              a.target = "_blank";
              a.style.display = "flex";

              const img = document.createElement("img");
              img.src = params.data.fbAvatar;
              img.className = "avatar";
              img.style = "margin-right: 5px;";
              img.onerror = () => {
                img.src = getUserAvatarFromUid(params.data.uid, 40);
              };
              a.appendChild(img);

              a.appendChild(document.createTextNode(params.data.fbName));

              return a;
            }
          },
        },
        { field: "isScript", width: 80 },
        { field: "eventName", width: 500, filter: "agTextColumnFilter" },
        {
          field: "totalCount",
          filter: "agNumberColumnFilter",
          width: 100,
        },
        // { field: "log", width: 400 },
      ],
      defaultColDef: {
        // flex: 1,
        filter: true,
        floatingFilter: true,
        filterParams: {
          maxNumConditions: 10,
          defaultJoinOperator: "OR",
        },
        suppressMovable: true,
      },
      onFilterChanged(params) {
        const data = [];
        params.api.forEachNodeAfterFilter((node) => {
          data.push(node.data);
        });
        chartOptions.data = createLogCountPerHour(data);
        AgCharts.update(chart, chartOptions);
      },
    });

    container.append(div);
    // #endregion

    // #region update fb users
    const uniqueUid = [...new Set(allUid)].filter(Boolean);
    if (uniqueUid.length) {
      initCache().then(() => {
        const promises = uniqueUid.map(
          (uid) => () =>
            getFbProfile(uid).then((info) => {
              if (!info.name || !info.avatar) return;
              const name = limitString(info.name, 40);
              const avatar = info.avatar.replace(/\\\//g, "/") || "";

              allLogs.forEach((log) => {
                if (log.uid === uid) {
                  log.fbName = name;
                  log.fbAvatar = avatar;
                }
              });
            })
        );
        UfsGlobal.Utils.promiseAllStepN(5, promises).then(() => {
          gridApi.setGridOption("rowData", allLogs);

          if (CACHED.newFbUsers.size) {
            const arr = Array.from(CACHED.newFbUsers.values());
            console.log("New users", arr);
            alert(
              CACHED.newFbUsers.size +
                " new users:\n\n" +
                arr.map((_) => _.name).join("\n")
            );
          }
        });
      });
    }
  }
  // #endregion

  // #region add date selector
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

  // #region auto get fb info of selected text on press A

  document.addEventListener("keydown", (event) => {
    const selectedText = UfsGlobal.DOM.getSelectionText();
    if (selectedText) {
      if (event.key === "a") {
        getEntityAbout(selectedText)
          .then((data) =>
            alert(data.type + ":\n" + data.name + "\n\n" + data.url)
          )
          .catch((e) => alert("ERROR: " + e.message));
      }
      if (event.key === "d") {
        window.open("https://fb.com/" + selectedText, "_blank");
      }
    }
  });

  // #endregion
}

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

function randColor() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

function isFbUid(uid) {
  return (
    /\d+/.test(uid) &&
    (uid?.startsWith("100") || (uid?.length && uid?.length != 13))
  );
}

const CACHED = {
  fbProfile: null,
  fb_dtsg: null,
  newFbUsers: new Map(),
};

async function initCache() {
  if (!CACHED.fbProfile) {
    CACHED.fbProfile = new Map();
    try {
      const c = localStorage.getItem("fbProfile");
      if (c) {
        const arr = JSON.parse(c);
        console.log(arr);
        arr.forEach((info) => CACHED.fbProfile.set(info.uid, info));
      }
    } catch (e) {
      console.error(e);
    }
  }

  if (!CACHED.fb_dtsg) {
    let res = await UfsGlobal.Extension.runInBackground("fetch", [
      "https://www.facebook.com/policies_center/",
    ]);
    CACHED.fb_dtsg = res?.body?.match?.(
      /DTSGInitData",\[\],\{"token":"(.*?)"/
    )?.[1];
  }
}

async function getFbProfile(uid, force = false) {
  const cached = CACHED.fbProfile.get(uid);
  if (cached?.name && !force) return cached;

  let res = await UfsGlobal.Extension.runInBackground("fetch", [
    "https://www.facebook.com/api/graphql/",
    {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        fb_api_req_friendly_name: "ProfileCometHeaderQuery",
        fb_dtsg: CACHED.fb_dtsg,
        variables: JSON.stringify({
          userID: uid,
          shouldDeferProfilePic: false,
          useVNextHeader: false,
          scale: 1.5,
        }),
        doc_id: "4159355184147969",
      }).toString(),
    },
  ]);
  let text = await res.body;
  const info = {
    uid: uid,
    name: UfsGlobal.DEBUG.decodeEscapedUnicodeString(
      /"name":"(.*?)"/.exec(text)?.[1]
    ),
    avatar: UfsGlobal.DEBUG.decodeEscapedUnicodeString(
      /"profilePicLarge":{"uri":"(.*?)"/.exec(text)?.[1] ||
        /"profilePicMedium":{"uri":"(.*?)"/.exec(text)?.[1] ||
        /"profilePicSmall":{"uri":"(.*?)"/.exec(text)?.[1] ||
        /"profilePic160":{"uri":"(.*?)"/.exec(text)?.[1]
    ),
    gender: /"gender":"(.*?)"/.exec(text)?.[1],
    alternateName: UfsGlobal.DEBUG.decodeEscapedUnicodeString(
      /"alternate_name":"(.*?)"/.exec(text)?.[1]
    ),
  };
  CACHED.newFbUsers.set(uid, info);
  CACHED.fbProfile.set(uid, info);
  localStorage.setItem(
    "fbProfile",
    JSON.stringify(Array.from(CACHED.fbProfile.values()))
  );
  console.log(info);
  return info;
}

export const TargetType = {
  User: "user",
  Page: "page",
  Group: "group",
  IGUser: "ig_user",
};

export async function getEntityAbout(entityID, context = "DEFAULT") {
  let res = await UfsGlobal.Extension.runInBackground("fetch", [
    "https://www.facebook.com/api/graphql/",
    {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        fb_api_req_friendly_name: "CometHovercardQueryRendererQuery",
        fb_dtsg: CACHED.fb_dtsg,
        variables: JSON.stringify({
          actionBarRenderLocation: "WWW_COMET_HOVERCARD",
          context: context,
          entityID: entityID,
          includeTdaInfo: true,
          scale: 1,
        }),
        doc_id: "7257793420991802",
      }).toString(),
    },
  ]);
  const text = await res.body;
  // console.log(res, text);
  const json = JSON.parse(text);
  const node = json.data.node;
  if (!node) throw new Error("Wrong ID / Entity not found");
  const typeText = node.__typename.toLowerCase();
  if (!Object.values(TargetType).includes(typeText))
    throw new Error("Not supported type: " + typeText);
  const card = node.comet_hovercard_renderer[typeText];
  const type =
    typeText === "user"
      ? card.profile_plus_transition_path?.startsWith("PAGE")
        ? TargetType.Page
        : TargetType.User
      : TargetType.Group;
  return {
    type,
    id: node.id || card.id,
    name: card.name,
    avatar: card.profile_picture.uri,
    url: card.profile_url || card.url,
    raw: json,
  };
}

// log example: 5/31/2024, 9:13:41 AM: OPEN-TAB-unlock (1.67-1717121281787) -> 43
function extractUid(log) {
  return /-(\d+)\)/.exec(log)?.[1] || "?";
}
function extractTime(log) {
  return (
    /\d{1,2}\/\d{1,2}\/\d{4}, \d{1,2}:\d{1,2}:\d{1,2} \w{2}/.exec(log)?.[0] ||
    ""
  );
}
function extractEventName(log) {
  return /: (.*?) \(/.exec(log)?.[1] || "";
}
function extractTotalCount(log) {
  return / -> (\d+)/.exec(log)?.[1] || "";
}
function extractVersion(log) {
  return / \((.*?)-\d*\)/.exec(log)?.[1] || "";
}

function isScript(log) {
  return !(
    log.includes("INSTALLED") ||
    log.includes("OPEN-") ||
    log.includes("CLICK_") ||
    log.includes("-INFO") ||
    log.includes("-FAVORITE") ||
    log.includes("-VIEW-SOURCE") ||
    log.includes("CHECK-FOR-UPDATE") ||
    log.includes("RESTORE") ||
    log.includes("BACKUP") ||
    log.includes("CHANGE-THEME") ||
    log.includes("CHANGE-SMOOTH-SCROLL") ||
    log.includes("getVIP")
  );
}

function limitString(string, length) {
  if (string.length <= length) return string;
  return string.substring(0, length - 3) + "...";
}

function padStr(string, length, char = " ") {
  return (
    string +
    (length - string.length > 0 ? char.repeat(length - string.length) : "")
  );
}
