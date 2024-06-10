import { BADGES } from "./helpers/badge.js";

const updateIcon = '<i class="fa-regular fa-circle-down"></i>';

export default {
  icon: "https://chongluadao.vn/wp-content/uploads/2021/04/cropped-favicon-150x150.png",
  name: {
    en: "Block trackers, spy and malware",
    vi: "Chống lừa đảo",
  },
  description: {
    en: `Alert when you access a dangerous website, malware or spy content<br/>
      <ul>
        <li style='color:yellow'>Click to analyze current website</li>
        <li>Click ${updateIcon} to fetch newest websites database</li>
      </ul>`,
    vi: `Cảnh báo khi bạn truy cập các trang web có nguy cơ lừa đảo, giả mạo, có nội dung xấu hoặc phần mềm độc hại<br/>
      <ul>
        <li style='color:yellow'>Click để tính toán độ an toàn của trang web hiện tại</li>
        <li>Click ${updateIcon} để cập nhật dữ liệu website giả mạo mới nhất</li>
      </ul>`,
  },
  badges: [BADGES.new],
  buttons: [
    {
      icon: updateIcon,
      name: {
        vi: "Cập nhật dữ liệu",
        en: "Update database",
      },
      onClick: onEnable,
    },
  ],

  changeLogs: {
    "2024-05-20": "init",
  },

  popupScript: {
    onEnable: onEnable,
    onDisable: async () => {
      const { Storage } = await import("./helpers/utils.js");
      Storage.remove(KEYS.blackList);
      Storage.remove(KEYS.whiteList);
      chrome.runtime.sendMessage({ action: KEYS.clearCache });
    },
  },

  contentScript: {
    // TODO analyze all iframes
    onDocumentIdle: (details) => {
      analyzeWeb(true);
    },

    onClick: () => analyzeWeb(false),
  },

  backgroundScript: {
    onDocumentStart_: async (details, context) => {
      if (!cached) await saveBgCache();
      if (!cached) return;

      let whiteListed = matchOneOfPatterns(details.url, cached.whiteList);
      if (whiteListed) {
        console.log("WhiteListed: " + whiteListed);
        return;
      }

      let blocked = matchOneOfPatterns(details.url, cached.blackList);
      if (blocked) {
        context.utils.runScriptInTab({
          target: {
            tabId: details.tabId,
          },
          func: (details, blocked) => {
            if (details.frameType === "outermost_frame") {
              if (
                confirm(
                  "Useful Script - Chống Lừa Đảo\n\n" +
                    blocked +
                    "\n\n" +
                    "Website bạn đang truy cập được ghi nhận là lừa đảo\n" +
                    "Khuyên bạn không nên tiếp tục truy cập trang web này\n\n" +
                    "Bấm ok để tắt trang web\n" +
                    "Bấm cancel để tiếp tục truy cập trang web"
                )
              )
                window.close();
            } else {
              prompt(
                "Useful Script - Chống Lừa Đảo\n\n" +
                  "Website bạn đang truy cập đã load thêm 1 iframe\n" +
                  "Iframe này được ghi nhận là lừa đảo\n\n" +
                  "HÃY CẨN THẬN!!\n\n" +
                  "Link iframe:",
                details.url
              );
            }
          },
          args: [details, blocked],
        });
      }
    },

    runtime: {
      onInstalled: (reason, context) => {
        saveBgCache();

        chrome.contextMenus.create({
          title: "Chong Lua Dao",
          type: "normal",
          id: "chongLuaDao",
          parentId: "root",
        });
      },
      onStartup: (nil, context) => {
        saveBgCache();
      },
      onMessage: ({ request, sender, sendResponse }, context) => {
        if (request.action === KEYS.saveCache) {
          saveBgCache();
        } else if (request.action == KEYS.clearCache) {
          clearBgCache();
        }
      },
    },
    contextMenus: {
      onClicked: ({ info, tab }, context) => {
        if (info.menuItemId == "chongLuaDao") {
          context.utils.runScriptInTabWithEventChain({
            target: {
              tabId: tab.id,
              frameIds: [0],
            },
            scriptIds: ["chongLuaDao"],
            eventChain: "contentScript.onClick",
            details: info,
            world: "ISOLATED",
          });
        }
      },
    },
  },
};

const KEYS = {
  blackList: "chongLuaDao_blackList",
  whiteList: "chongLuaDao_whiteList",
  saveCache: "ufs-chongLuaDao-saveCache",
  clearCache: "ufs-chongLuaDao-clearCache",
};

function getStorage(key, defaultValue = null) {
  return chrome.storage.local
    .get([key])
    .then((data) => data?.[key] ?? defaultValue);
}

// ===================== bg script context =====================
let cached = null;

async function saveBgCache() {
  try {
    cached = {
      blackList: await getStorage(KEYS.blackList, []),
      whiteList: await getStorage(KEYS.whiteList, []),
    };
  } catch (e) {
    console.log("cache chongLuaDao FAIL ", e);
  }
  return null;
}

function clearBgCache() {
  cached = null;
}

// ===================== popup script context =====================
async function onEnable() {
  const { t } = await import("../popup/helpers/lang.js");
  const { showLoading, Storage } = await import("./helpers/utils.js");
  const { setLoadingText, closeLoading } = showLoading(
    t({ vi: "Đang tải dữ liệu...", en: "Downloading data..." })
  );

  let blackList = [],
    whiteList = [];
  let lastUpdateTime = {
    blackList: 0,
    whiteList: 0,
  };

  try {
    setLoadingText(
      t({
        vi: "Bạn chờ một chút nhé (~ 30s)<br/>Đang tải danh sách trang web ĐỘC HẠI...",
        en: "Please wait (~ 30s)<br/>Downloading DANGER websites list...",
      })
    );
    let res = await fetch("https://api.chongluadao.vn/v2/blacklist");
    let data = await res.json();

    let created = data.map((_) => new Date(_.created).getTime() || 0);
    created.sort((a, b) => b - a);
    lastUpdateTime.blackList = new Date(created[0]).toISOString().split("T")[0];

    blackList = Array.from(new Set(data.map((e) => e.url)));
    blackList.sort();
    Storage.set(KEYS.blackList, blackList);
  } catch (error) {
    alert("Error: " + error);
    console.log(error);
  }

  try {
    setLoadingText(
      t({
        vi: "Đang tải danh sách trang web AN TOÀN...",
        en: "Downloading SAFE websites list...",
      })
    );
    let res = await fetch("https://api.chongluadao.vn/v2/whitelist");
    let data = await res.json();

    let created = data.map((_) => new Date(_.created).getTime() || 0);
    created.sort((a, b) => b - a);
    lastUpdateTime.whiteList = new Date(created[0]).toISOString().split("T")[0];

    whiteList = Array.from(new Set(data.map((e) => e.url)));
    whiteList.sort();
    Storage.set(KEYS.whiteList, whiteList);
  } catch (error) {
    alert("Error: " + error);
    console.log(error);
  }
  closeLoading();

  chrome.runtime.sendMessage({ action: KEYS.saveCache });

  await Swal.fire({
    icon: "success",
    title: t({
      vi: "Tải xong",
      en: "Loaded",
    }),
    html: t({
      vi:
        `${blackList.length} web độc hại (${lastUpdateTime.blackList})<br/>` +
        `${whiteList.length} web an toàn (${lastUpdateTime.whiteList})`,
      en:
        `${blackList.length} DANGER web (${lastUpdateTime.blackList})<br/>` +
        `${whiteList.length} SAFE web (${lastUpdateTime.whiteList})`,
    }),
  });

  return true;
}

// ===================== content script context =====================
async function analyzeWeb(onlyShowUIIfNotSafe = false) {
  const href = window.location.href,
    hostname = window.location.hostname,
    host = hostname.replace("www.", "");

  const ipv4Regex =
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  const ipv6Regex = /^0x([0-9a-fA-F]{2})(.|$){3}[0-9a-fA-F]{2}$/;

  const features = {
    "IP Address": {
      desc: {
        vi: "Đường dẫn trang web là địa chỉ IP",
        en: "The website's url is an IP address",
      },
      value: ipv4Regex.test(hostname) || ipv6Regex.test(hostname) ? 1 : -1,
    },

    "URL Length": {
      desc: {
        vi: "Độ dài đường dẫn trang web quá dài > 75",
        en: "The website's url too long > 75",
      },
      value:
        href.length < 54 ? -1 : href.length >= 54 && href.length <= 75 ? 0 : 1,
    },
    "Tiny URL": {
      desc: {
        vi: "Đường dẫn trang web quá ngắn < 7",
        en: "The website's url length too short < 7",
      },
      value: host.length < 7 ? 1 : -1,
    },
    "@ Symbol": {
      desc: {
        vi: "Đường dẫn trang web chứa ký tự @",
        en: "The website's url contains @ symbol",
      },
      value: /@/.test(href) ? 1 : -1,
    },
    "Redirecting using //": {
      desc: {
        vi: "Đường dẫn trang web có chứa //",
        en: "The website's url contains //",
      },
      value: href.lastIndexOf("//") > 7 ? 1 : -1,
    },
    "(-) Prefix/Suffix in domain": {
      desc: {
        vi: "Chứa ký tự (-) trong tên domain",
        en: "Contains (-) character in domain name",
      },
      value: /-/.test(hostname) ? 1 : -1,
    },
    "No. of Sub Domains": {
      desc: {
        vi: "Chứa nhiều hơn 2 tên miền phụ (sub domains)",
        en: "Contains more than 2 sub domains",
      },
      value: (() => {
        let len = (host.match(RegExp("\\.", "g")) || []).length;
        return len == 1 ? -1 : len == 2 ? 0 : 1;
      })(),
    },
    HTTPS: {
      desc: {
        vi: "Không có bảo mật HTTPS",
        en: "No HTTPS protocol",
      },
      value: /https:\/\//.test(href) ? -1 : 1,
    },
    Favicon: {
      desc: {
        vi: "Favicon không cùng tên miền",
        en: "Favicon doesn't on the same domain",
      },
      value: (() => {
        let icon;
        const links = document.getElementsByTagName("link");
        for (let i = 0; i < links.length; i++) {
          if (
            "icon" == links[i].getAttribute("rel") ||
            "shortcut icon" == links[i].getAttribute("rel")
          )
            icon = links[i].getAttribute("href");
        }
        if (!icon) return -1;
        return isSameOrigin(icon) ? -1 : 1;
      })(),
    },
    "HTTPS in URL's domain part": {
      desc: {
        vi: "Chứa HTTPS trong tên domain",
        en: "Contains https in domain name",
      },
      value: /https/.test(host) ? 1 : -1,
    },
    "Request URL": {
      desc: {
        vi: "> 61% hình ảnh được tải từ domain khác",
        en: "> 61% of images are loaded from other domain ",
      },
      value: (() => {
        const l = document.getElementsByTagName("img");
        let externalSrc = 0,
          internalSrc = 0;
        let externals = [];
        for (let t = 0; t < l.length; t++) {
          const src = l[t].getAttribute("src");
          if (src) {
            if (isSameOrigin(src)) internalSrc++;
            else {
              externals.push(src);
              externalSrc++;
            }
          }
        }
        console.log("imgs external", externals);
        let total = externalSrc + internalSrc,
          percent = (externalSrc / (total || 1)) * 100;
        return percent < 22 ? -1 : percent >= 22 && percent < 61 ? 0 : 1;
      })(),
    },
    Anchor: {
      desc: {
        vi: "> 67% link trỏ tới domain khác",
        en: "> 67% links are pointing to other domain",
      },
      value: (() => {
        const anchors = document.getElementsByTagName("a");
        let internal = 0,
          external = 0,
          externals = [];
        for (let t = 0; t < anchors.length; t++) {
          const href = anchors[t].getAttribute("href");
          if (href) {
            if (isSameOrigin(href)) internal++;
            else {
              externals.push(href);
              external++;
            }
          }
        }
        console.log("links external", externals);
        let total = internal + external,
          percent = (external / (total || 1)) * 100;
        return percent < 31 ? -1 : percent >= 31 && percent <= 67 ? 0 : 1;
      })(),
    },
    "Script & Link": {
      desc: {
        vi: "> 81% script hoặc css được tải từ domain khác",
        en: "> 81% scripts or css are loaded from other domain",
      },
      value: (() => {
        const scripts = document.getElementsByTagName("script"),
          links = document.getElementsByTagName("link");
        let external = 0,
          internal = 0,
          externals = [];
        for (let t = 0; t < scripts.length; t++) {
          const src = scripts[t].getAttribute("src");
          if (src != null) {
            if (isSameOrigin(src)) internal++;
            else {
              externals.push(src);
              external++;
            }
          }
        }
        for (let t = 0; t < links.length; t++) {
          const href = links[t].getAttribute("href");
          if (href) {
            if (isSameOrigin(href)) internal++;
            else {
              externals.push(href);
              external++;
            }
          }
        }
        console.log("scripts + links external", externals);
        let total = external + internal,
          percent = (external / (total || 1)) * 100;
        return percent < 17 ? -1 : percent >= 17 && percent <= 81 ? 0 : 1;
      })(),
    },
    SFH: {
      desc: {
        vi: "Có chứa form không có action hoặc trỏ tời domain khác",
        en: "Contains form without action or pointing to other domain",
      },
      value: (() => {
        const form = document.getElementsByTagName("form");
        for (let t = 0; t < form.length; t++) {
          const action = form[t].getAttribute("action");
          if (!action || "" == action) {
            return 1;
          }
          if ("/" != action.charAt(0) && !isSameOrigin(action)) return 0;
        }
        return -1;
      })(),
    },
    mailto: {
      desc: {
        vi: "Chứa form có action mailto (gửi email tới người khác)",
        en: "Contains form with action mailto (send email to other domain)",
      },
      value: (() => {
        const form = document.getElementsByTagName("form");
        for (let t = 0; t < form.length; t++) {
          const action = form[t].getAttribute("action");
          if (action && action.startsWith("mailto")) {
            return 1;
          }
        }
        return -1;
      })(),
    },
    iFrames: {
      desc: {
        vi: "Có iframe",
        en: "Contains iframes",
      },
      value: (() => {
        const iframes = document.getElementsByTagName("iframe");
        return iframes.length > 0 ? 1 : -1;
      })(),
    },
  };

  console.log("Webpage Features:", features);
  let dangerCount = 0,
    normalCount = 0,
    safeCount = 0;

  for (let feature in features) {
    let val = features[feature].value;
    if (val == 1) dangerCount++;
    else if (val == 0) normalCount++;
    else if (val == -1) safeCount++;
  }

  const legitimatePercents =
    (safeCount / (safeCount + normalCount + dangerCount)) * 100;
  let isSafe = legitimatePercents >= 62;

  console.log("Legitimate Percent:", legitimatePercents);

  if (!isSafe) {
    const whiteList = await getStorage("chongLuaDao_whiteList");
    let whiteListed = matchOneOfPatterns(href, whiteList);
    if (whiteListed) isSafe = true;
    else console.log("Not whiteListed: " + href);
  }

  if (onlyShowUIIfNotSafe && isSafe) return;
  showResult({ features, legitimatePercents, isSafe });
}

function showResult({ features, isSafe, legitimatePercents }) {
  const id = "ufs-chongLuaDao";
  let exist = document.getElementById(id);
  if (exist) exist.remove();

  const size = 100,
    color = isSafe ? "#28a745" : "#cc0000",
    text = isSafe
      ? "Website này có thể an toàn"
      : "Website này có thể KHÔNG AN TOÀN";

  const featureDiv = Object.keys(features)
    .map((key) => {
      let val = features[key].value;
      let desc = features[key].desc;
      let color = val == -1 ? "#28a745" : val == 0 ? "#f0ad4e" : "#cc0000";
      return /* html */ `
    <span class="feature" title="${desc.vi}" data-value="${val}" style="background: ${color};color: white;">
      ${key}
    </span>
  `;
    })
    .join("");

  let resultDiv = document.createElement("div");
  resultDiv.id = id;
  resultDiv.innerHTML = /* html */ `
  <p class="text">Useful Scripts - Chống Lừa Đảo</p>
  <div class="progress-container">
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" class="ufs-circular-progress" style="--progress: ${legitimatePercents}">
      <circle class="bg"></circle>
      <circle class="fg"></circle>
    </svg>
    <p class="progress-value">${legitimatePercents.toFixed(0)}%</p>
  </div>
  <p class="text" style="color: ${color}">${text}</p>
  <div class="feature-container">${featureDiv}</div>
  <br/>
  <p id="ufs-description"></p>
  <button id="ufs-close">X</button>
  <style>
    #${id} #ufs-close {
      position: absolute;
      top: 10px;
      right: 10px;
      width: 30px;
      height: 30px;
      padding: 0;
      margin: 0;
      background: #54545463;
      border-radius: 5px;
      border: none;
      color: white;
      font-size: 20px;
      text-align: center;
      cursor: pointer;
    }
    #${id} #ufs-close:hover {
      background: red;
    }
    #${id} {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 99999999;
      background: white;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
      padding: 10px;
      border-radius: 5px;
      max-width: 400px;
    }
    #${id} .text {
      font-family: sans-serif;
      text-align: center;
      font-size: 18px;
      font-weight: bold;
      margin: 10px 0;
      color: #333;
    }
    #${id} .feature-container {
      margin-top: 10px;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 5px;
    }
    #${id} .feature {
      margin: 0;
      padding: 5px 10px;
      border-radius: 15px;
      transition: all 0.1s ease;
    }
    #${id} .feature:hover {
      transform: scale(1.1);
    }
    #${id} #ufs-description {
      font-family: sans-serif;
      text-align: center;
      font-size: 14px;
      margin: 0;
      color: #333;
    }
    #${id} .progress-container {
      position: relative;
      text-align: center;
    }
    #${id} .progress-value {
      color: ${color};
      font-size: 20px;
      font-weight: bold;
      text-align: center;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      margin: 0;
      font-family: monospace;
    }
    .ufs-circular-progress {
      --size: ${size}px;
      --half-size: calc(var(--size) / 2);
      --stroke-width: 15px;
      --radius: calc((var(--size) - var(--stroke-width)) / 2);
      --circumference: calc(var(--radius) * pi * 2);
      --dash: calc((var(--progress) * var(--circumference)) / 100);
    }
    .ufs-circular-progress circle {
      cx: var(--half-size);
      cy: var(--half-size);
      r: var(--radius);
      stroke-width: var(--stroke-width);
      fill: none;
      stroke-linecap: round;
    }
    .ufs-circular-progress circle.bg {
        stroke: #ddd;
    }
    .ufs-circular-progress circle.fg {
      transform: rotate(-90deg);
      transform-origin: var(--half-size) var(--half-size);
      stroke-dasharray: var(--dash) calc(var(--circumference) - var(--dash));
      transition: stroke-dasharray 0.3s linear 0s;
      stroke: ${color};
    }
  </style>
`;
  document.body.appendChild(resultDiv);

  const closeBtn = document.querySelector(`#${id} #ufs-close`);
  closeBtn?.addEventListener("click", () => {
    resultDiv.remove();
  });

  const description = document.querySelector(`#${id} #ufs-description`);
  const featuresDiv = document.querySelectorAll(`#${id} .feature`);
  featuresDiv.forEach((feature) => {
    feature.addEventListener("mouseenter", () => {
      let value = feature.getAttribute("data-value");
      description.innerHTML =
        value == 1
          ? `<b>Không an toàn:</b> ${feature.getAttribute("title")}`
          : `<b>An toàn:</b> <strike>
        ${feature.getAttribute("title")}</strike>`;
    });
  });
}

function getAbsoluteUrl(url) {
  return new URL(url, window.location.href).href;
}

function isSameOrigin(url) {
  return new URL(url, window.location.href).origin === window.location.origin;
}

function matchOneOfPatterns(url, patterns) {
  if (!patterns?.length) return false;
  for (let pattern of patterns) {
    const regex = new RegExp(
      "^" +
        pattern
          .split("*")
          .map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
          .join(".*")
          .replace("http://", "http(s?)://")
    );
    if (regex.test(url)) return pattern;
  }
  return false;
}
