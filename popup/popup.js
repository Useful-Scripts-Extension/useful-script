import { getFlag, LANG, setLang, t, toggleLang } from "./lang.js";
import { tabs } from "./scripts/tabs.js";
import {
  localStorage,
  runScriptFileInCurrentTab,
  runScriptInCurrentTab,
} from "./utils.js";

const tabDiv = document.querySelector("div.tab");
const contentDiv = document.querySelector("div.content");
const flagImg = document.querySelector("img#flag");

async function initLanguage() {
  let lang = await localStorage.get("lang", LANG.vi);
  setLang(lang);
  flagImg.setAttribute("src", getFlag());

  flagImg.onclick = () => {
    let newLang = toggleLang();
    localStorage.set("lang", newLang);
    flagImg.setAttribute("src", getFlag());

    // reset UI
    createTabs();
  };
}

async function createTabs() {
  // clear UI
  tabDiv.innerHTML = "";
  contentDiv.innerHTML = "";

  // make new UI
  for (let tab of tabs) {
    // create tab button
    const tabBtn = document.createElement("button");
    tabBtn.className = "tablinks";
    tabBtn.textContent = t(tab.name);
    tabBtn.title = t(tab.description);
    tabBtn.type = "button";
    tabBtn.setAttribute("content-id", tab.id);
    tabBtn.onclick = () => openTab(tab.id);

    // create tab content
    const contentContainer = document.createElement("div");
    contentContainer.id = tab.id;
    contentContainer.className = "tabcontent";

    // create button for scripts in tabcontent
    if (!tab.scripts?.length) {
      const emptyText = document.createElement("h3");
      emptyText.innerText = "Coming soon...";
      contentContainer.appendChild(emptyText);
    } else {
      for (let script of tab.scripts) {
        // Section title
        if (!script.func && !script.file) {
          const title = document.createElement("h3");
          title.textContent = t(script.name);
          title.classList.add("section-title");

          contentContainer.appendChild(title);
        }

        // Function button
        else {
          const button = document.createElement("button");
          button.innerText = t(script.name);
          button.className = "tooltip";

          if (script.file && typeof script.file === "string") {
            button.onclick = () => runScriptFileInCurrentTab(script.file);
          } else if (script.func && typeof script.func === "function") {
            button.onclick = () => runScriptInCurrentTab(script.func);
          } else {
            button.onclick = () => alert("empty script");
          }

          const tooltip = document.createElement("span");
          tooltip.className = "tooltiptext";
          tooltip.innerText = t(script.description);
          button.appendChild(tooltip);

          contentContainer.appendChild(button);
          contentContainer.appendChild(document.createElement("br"));
        }
      }
    }

    // inject to DOM
    tabDiv.appendChild(tabBtn);
    contentDiv.appendChild(contentContainer);
  }

  // open tab
  let activeTab = await localStorage.get("activeTab", tabs[0].id);
  activeTab && openTab(activeTab);
}

function openTab(tabId) {
  localStorage.set("activeTab", tabId);

  Array.from(document.querySelectorAll(".tabcontent")).forEach((_) => {
    _.style.display = "none";
  });
  Array.from(document.querySelectorAll(".tablinks")).forEach((_) => {
    _.classList.remove("active");
  });
  document.querySelector(".tabcontent#" + tabId).style.display = "block";
  document
    .querySelector('.tablinks[content-id="' + tabId + '"]')
    .classList.add("active");
}

(async function () {
  await initLanguage();
  await createTabs();
})();
