import { MsgType } from "../scripts/helpers/constants.js";
import {
  checkBlackWhiteList,
  isActiveScript,
  getCurrentTab,
  isFunction,
  removeAccents,
  runScriptInCurrentTab,
  sendEventToTab,
  toggleActiveScript,
  trackEvent,
} from "../scripts/helpers/utils.js";
import { checkForUpdate } from "./helpers/checkForUpdate.js";
import { getFlag, t, toggleLang } from "./helpers/lang.js";
import { openModal } from "./helpers/modal.js";
import {
  activeTabIdSaver,
  favoriteScriptsSaver,
  recentScriptsSaver,
} from "./helpers/storage.js";
import {
  canAutoRun,
  canClick,
  isTitle,
  viewScriptSource,
} from "./helpers/utils.js";
import { refreshSpecialTabs, getAllTabs } from "./tabs.js";
import _ from "../md/exportScriptsToMd.js";

const tabDiv = document.querySelector("div.tab");
const contentDiv = document.querySelector("div.content");
const flagImg = document.querySelector("img#flag");
const searchInput = document.querySelector(".search input");
const searchFound = document.querySelector(".search .searchFound");

function initLanguage() {
  flagImg.setAttribute("src", getFlag());

  flagImg.onclick = () => {
    let newLang = toggleLang();
    flagImg.setAttribute("src", getFlag());

    trackEvent("CHANGE-LANGUAGE-" + newLang);

    // reset UI
    createTabs();
    checkForUpdate();
  };
}

function createTabs() {
  // prepare tabs
  refreshSpecialTabs();

  // clear UI
  tabDiv.innerHTML = "";
  contentDiv.innerHTML = "";

  // make new UI
  const allTabs = getAllTabs();
  for (let tab of allTabs) {
    // create tab button
    const tabBtn = document.createElement("button");
    tabBtn.className = "tablinks";
    tabBtn.innerHTML = t(tab.name);
    tabBtn.type = "button";
    tabBtn.setAttribute("content-id", tab.id);

    // show scripts count
    if (tab.showCount) {
      let avaiCount = tab.scripts.filter((script) => !isTitle(script)).length;
      tabBtn.innerHTML += ` (${avaiCount})`;
    }

    // custom style
    if (tab.style && typeof tab.style === "object")
      Object.entries(tab.style).forEach(([key, value]) => {
        tabBtn.style[key] = value;
      });

    tabBtn.onclick = () => {
      trackEvent("OPEN-TAB-" + tab.id);
      openTab(tab);
    };

    tabDiv.appendChild(tabBtn);
  }

  // open tab
  let activeTabId = activeTabIdSaver.get();
  activeTabId && openTab(allTabs.find((tab) => tab.id === activeTabId));
}

async function openTab(tab) {
  activeTabIdSaver.set(tab.id);
  createTabContent(tab);

  Array.from(document.querySelectorAll(".tablinks")).forEach((_) => {
    _.classList.remove("active");
  });
  document
    .querySelector('.tablinks[content-id="' + tab.id + '"]')
    .classList.add("active");
}

async function createTabContent(tab) {
  // search bar
  let scriptsCount = tab.scripts.filter((_) => !isTitle(_)).length;
  searchInput.value = "";
  searchInput.placeholder = t({
    vi: "Tìm trong " + scriptsCount + " chức năng...",
    en: "Search in " + scriptsCount + " scripts...",
  });
  searchInput.focus?.();

  // create tab content
  const contentContainer = document.createElement("div");
  contentContainer.className = "tabcontent";

  // create button for scripts in tabcontent
  if (!tab.scripts?.length) {
    const emptyText = document.createElement("h3");
    emptyText.style.padding = "30px 0";
    emptyText.style.color = "#19143b";
    emptyText.innerHTML = t({
      en: `<i class="fa-solid fa-circle-info"></i> Nothing here yet...`,
      vi: `<i class="fa-solid fa-circle-info"></i> Chưa có gì ở đây hết...`,
    });
    contentContainer.appendChild(emptyText);
  } else {
    const favoriteScriptIds = favoriteScriptsSaver.getIds();
    tab.scripts.forEach((script) => {
      let isFavorite = favoriteScriptIds.find((id) => script.id === id);
      contentContainer.appendChild(createScriptButton(script, isFavorite));
    });
  }

  // inject to DOM
  contentDiv.innerHTML = "";
  contentDiv.appendChild(contentContainer);
}

function createScriptButton(script, isFavorite = false) {
  // Section title
  if (isTitle(script)) {
    const title = document.createElement("h3");
    title.innerHTML = t(script.name);
    title.classList.add("section-title");

    return title;
  }

  // Button Container
  const buttonContainer = document.createElement("div");
  buttonContainer.className = "buttonContainer";

  // button checker
  if (canAutoRun(script)) {
    const checkmark = document.createElement("button");
    checkmark.className = "checkmark tooltip";
    checkmark.onclick = async (e) => {
      let newValue = await toggleActiveScript(script.id);
      trackEvent(script.id + (newValue ? "-ON" : "-OFF"));
      newValue ? script.onEnable?.() : script.onDisable?.();
      updateButtonChecker(script, buttonContainer, newValue);
    };

    buttonContainer.appendChild(checkmark);
    updateButtonChecker(script, buttonContainer);
  }

  // button
  const button = document.createElement("button");
  button.className = "tooltip";
  if (canClick(script)) {
    button.onclick = () => runScript(script);
  } else if (canAutoRun(script)) {
    button.onclick = () =>
      alert(
        t({
          vi: "Chức năng này tự động chạy.\nTắt/Mở tự chạy bằng nút bên trái.\nSau đó tải lại trang web.",
          en: "This function is Autorun.\nTurn on/off autorun by click the left checkmark.\nThen reload the webpage.",
        })
      );
  } else {
    alert(t({ vi: "Chức năng chưa hoàn thành", en: "Coming soon" }));
  }

  // script badges
  if (script.badges?.length > 0) {
    const badgeContainer = document.createElement("div");
    badgeContainer.classList.add("badgeContainer");

    script.badges?.map((badge) => {
      const { text, color, backgroundColor } = badge;
      const badgeItem = document.createElement("span");
      badgeItem.classList.add("badge");
      badgeItem.innerHTML = t(text);
      badgeItem.style.color = color;
      badgeItem.style.backgroundColor = backgroundColor;

      badgeContainer.appendChild(badgeItem);
    });

    button.appendChild(badgeContainer);
  }

  // button icon
  if (script.icon && typeof script.icon === "string") {
    // image icon
    if (
      script.icon.startsWith("/") ||
      script.icon.startsWith("http://") ||
      script.icon.startsWith("https://") ||
      script.icon.startsWith("data:image")
    ) {
      const icon = document.createElement("img");
      icon.classList.add("icon-img");
      icon.src = script.icon;
      button.appendChild(icon);
    }

    // text/html icon
    else {
      const icon = document.createElement("span");
      icon.classList.add("icon-html");
      icon.innerHTML = script.icon;
      button.appendChild(icon);
    }
  }

  // button title
  const title = document.createElement("span");
  title.classList.add("btn-title");
  title.innerHTML = t(script.name);
  button.appendChild(title);

  // what this? button
  if (typeof script.infoLink === "string") {
    const infoBtn = document.createElement("i");
    infoBtn.className = "fa-regular fa-circle-question";
    infoBtn.title = t({
      en: "View info/demo",
      vi: "Xem giới thiệu/demo",
    });
    infoBtn.onclick = (e) => {
      e.stopPropagation();
      e.preventDefault();
      trackEvent(script.id + "-INFO");
      window.open(script.infoLink);
    };
    button.appendChild(infoBtn);
  }

  // add to favorite button
  const addFavoriteBtn = document.createElement("i");
  addFavoriteBtn.className = isFavorite
    ? "fa-solid fa-star star active"
    : "fa-regular fa-star star";
  addFavoriteBtn.title = isFavorite
    ? t({
        en: "Remove from favorite",
        vi: "Xoá khỏi yêu thích",
      })
    : t({
        en: "Add to farovite",
        vi: "Thêm vào yêu thích",
      });
  addFavoriteBtn.onclick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    trackEvent(script.id + (isFavorite ? "-REMOVE-FAVORITE" : "-ADD-FAVORITE"));
    favoriteScriptsSaver.toggle(script);
    createTabs();
  };
  button.appendChild(addFavoriteBtn);

  // view source button
  const viewSourceBtn = document.createElement("i");
  viewSourceBtn.title = t({
    en: "View script source",
    vi: "Xem mã nguồn",
  });
  viewSourceBtn.className = "fa-solid fa-code view-source";
  viewSourceBtn.onclick = (e) => {
    e.stopPropagation();
    e.preventDefault();

    trackEvent(script.id + "-VIEW-SOURCE");
    viewScriptSource(script);
  };
  button.appendChild(viewSourceBtn);

  // tooltip
  const tooltip = document.createElement("span");
  tooltip.classList.add("tooltiptext");
  tooltip.innerHTML = t(script.description);
  if (script.description?.img) {
    tooltip.innerHTML += `<img src="${script.description.img}" style="width:95%" />`;
  }
  if (script.changeLogs) {
    let tx = "";
    for (let ver in script.changeLogs) {
      let dates = Object.keys(script.changeLogs[ver]).sort().reverse();
      for (let date of dates) {
        tx += `<li>${date} - ${script.changeLogs[ver][date]}</li>`;
      }
    }
    tooltip.innerHTML += `<ul class="change-logs">${tx}</ul>`;
  }
  button.appendChild(tooltip);

  buttonContainer.appendChild(button);
  return buttonContainer;
}

async function updateButtonChecker(script, button, val) {
  let checkmark = button.querySelector(".checkmark");
  if (!checkmark) return;
  if (val ?? (await isActiveScript(script.id))) {
    checkmark.classList.add("active");
    checkmark.title = t({
      vi: "Tắt tự động chạy",
      en: "Turn off Autorun",
    });
  } else {
    checkmark.classList.remove("active");
    checkmark.title = t({
      vi: "Bật tự động chạy",
      en: "Turn on Autorun",
    });
  }
}

async function runScript(script) {
  let tab = await getCurrentTab();
  let willRun = checkBlackWhiteList(script, tab.url);
  if (willRun) {
    try {
      recentScriptsSaver.add(script);
      trackEvent(script.id);
      if (isFunction(script.onClickExtension)) await script.onClickExtension();
      if (isFunction(script.onClick))
        await runScriptInCurrentTab(script.onClick);
      if (isFunction(script.onClickContentScript))
        await sendEventToTab(tab.id, {
          type: MsgType.runScript,
          scriptId: script.id,
        });
    } catch (e) {
      console.log("ERROR: run script", e);
    }
  } else {
    let w = script?.whiteList?.join(", ");
    let b = script?.blackList?.join(", ");

    openModal(
      t({
        en: `Script not supported in current website (${tab.url})`,
        vi: `Script không hỗ trợ website hiện tại (${tab.url})`,
      }),
      t({
        en:
          `${w ? `+ Only run at:  ${w}` : ""}<br />` +
          `${b ? `+ Not run at:  ${b}` : ""}`,
        vi:
          `${w ? `+ Chỉ chạy tại:  ${w}` : ""}<br />` +
          `${b ? `+ Không chạy tại:  ${b}` : ""}`,
      })
    );
  }
}

function initSearch() {
  searchInput.addEventListener("input", (event) => {
    let keyword = event.target.value;
    let found = 0;
    let childrens = document
      .querySelector(".tabcontent")
      .querySelectorAll(".buttonContainer");

    childrens.forEach((child) => {
      let willShow = true;
      let text = removeAccents(child.textContent).toLowerCase();
      let searchStr = removeAccents(keyword)
        .toLowerCase()
        .split(" ")
        .filter((_) => _);

      for (let s of searchStr) {
        if (text.indexOf(s) == -1) {
          willShow = false;
          break;
        }
      }
      child.style.display = willShow ? "block" : "none";
      if (willShow) found++;
    });
    searchFound.innerText = keyword
      ? `${found}/${childrens.length} scripts`
      : "";
  });
}

function initTracking() {
  let trackingEles = document.querySelectorAll("[data-track]");

  trackingEles.forEach((ele) => {
    ele.onclick = () => {
      trackEvent("CLICK_" + ele.getAttribute("data-track"));
    };
  });
}

(async function () {
  trackEvent("OPEN-POPUP");

  initTracking();
  initSearch();
  initLanguage();
  createTabs();
  await checkForUpdate();
})();
