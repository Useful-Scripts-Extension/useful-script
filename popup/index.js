import config from "../config.js";
import { allScripts } from "../scripts/index.js";
import { isTitle, refreshSpecialTabs, specialTabs, tabs } from "./tabs.js";
import { getFlag, t, toggleLang } from "./helpers/lang.js";
import { checkBlackWhiteList, runScriptInCurrentTab } from "./helpers/utils.js";
import {
  activeTabIdSaver,
  favoriteScriptsSaver,
  recentScriptsSaver,
} from "./helpers/storage.js";

const tabDiv = document.querySelector("div.tab");
const contentDiv = document.querySelector("div.content");
const flagImg = document.querySelector("img#flag");
const versionSpan = document.querySelector("#version");
const updateBtn = document.querySelector("#update-btn");

async function initLanguage() {
  flagImg.setAttribute("src", getFlag());

  flagImg.onclick = async () => {
    await toggleLang();
    flagImg.setAttribute("src", getFlag());

    // reset UI
    createTabs();
    checkForUpdate();
  };
}

async function createTabs() {
  // prepare tabs
  await refreshSpecialTabs();

  // clear UI
  tabDiv.innerHTML = "";
  contentDiv.innerHTML = "";

  // make new UI
  const allTabs = [...specialTabs, ...tabs];
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
      let allCount = Object.keys(allScripts).length;
      tabBtn.innerHTML += ` (${avaiCount}/${allCount})`;
    }

    // custom style
    if (tab.style && typeof tab.style === "object")
      Object.entries(tab.style).forEach(([key, value]) => {
        tabBtn.style[key] = value;
      });

    tabBtn.onclick = () => {
      openTab(tab);
    };

    tabDiv.appendChild(tabBtn);
  }

  // open tab
  let activeTabId = await activeTabIdSaver.get();
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
    const favoriteScriptIds = await favoriteScriptsSaver.getIds();
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

  // Button
  const button = document.createElement("button");
  button.className = "tooltip";

  if (script.func && typeof script.func === "function") {
    button.onclick = () => runScript(script);
  } else if (script.link && typeof script.link === "string") {
    button.onclick = () => window.open(script.link);
  } else {
    button.onclick = () => alert("empty script");
  }

  // script badges
  if (script.badges?.length > 0) {
    const badgeContainer = document.createElement("div");
    badgeContainer.classList.add("badgeContainer");

    script.badges?.map((badge) => {
      const { text, color, backgroundColor } = badge;
      const badgeItem = document.createElement("span");
      badgeItem.classList.add("badge");
      badgeItem.innerText = t(text);
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
      script.icon.indexOf("http://") === 0 ||
      script.icon.indexOf("https://") === 0
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

  // add to favorite button
  const addFavoriteBtn = document.createElement("i");
  addFavoriteBtn.className = isFavorite
    ? "fa-solid fa-star star active"
    : "fa-regular fa-star star";
  addFavoriteBtn.onclick = (e) => {
    e.stopPropagation();
    e.preventDefault();

    favoriteScriptsSaver.toggle(script).then(createTabs);
  };
  button.appendChild(addFavoriteBtn);

  // tooltip
  const tooltip = document.createElement("span");
  tooltip.classList.add("tooltiptext");
  tooltip.innerText = t(script.description);
  button.appendChild(tooltip);

  return button;
}

async function runScript(script) {
  let willRun = await checkBlackWhiteList(script);
  if (willRun) {
    recentScriptsSaver.add(script);
    runScriptInCurrentTab(script.func);
  }
}

async function checkForUpdate() {
  try {
    const currentVer = (await chrome.runtime.getManifest()).version;
    versionSpan.innerHTML = "v" + currentVer;

    const { version_check, source_code } = config;
    const lastestVer = (await (await fetch(version_check)).json()).version;
    if (lastestVer > currentVer) {
      updateBtn.style.display = "inline-block";
      updateBtn.innerHTML = t({
        vi: "cập nhật v" + lastestVer,
        en: "update v" + lastestVer,
      });
      updateBtn.onclick = () => {
        window.open(source_code);
      };
    } else {
      updateBtn.style.display = "none";
      versionSpan.innerHTML += t({ vi: " (mới nhất)", en: " (lastest)" });
    }
  } catch (e) {
    console.warn("Check for update failed", e);
  }
}

(async function () {
  await initLanguage();
  await createTabs();
  await checkForUpdate();
})();
