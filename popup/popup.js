import { tabs } from "./scripts/index.js";
import { runScriptFileInCurrentTab, runScriptInCurrentTab } from "./utils.js";

function createTabs() {
  const tabDiv = document.querySelector("div.tab");
  const contentDiv = document.querySelector("div.content");

  // clear UI
  tabDiv.innerHTML = "";
  contentDiv.innerHTML = "";

  // make new UI
  for (let tab of tabs) {
    // create tab button
    const tabBtn = document.createElement("button");
    tabBtn.className = "tabLinks";
    tabBtn.textContent = tab.name;
    tabBtn.title = tab.description;
    tabBtn.onclick = () => openTab(tabBtn, tab.id);

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
        const button = document.createElement("button");
        button.innerText = script.name;
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
        tooltip.innerText = script.description;
        button.appendChild(tooltip);

        contentContainer.appendChild(button);
        contentContainer.appendChild(document.createElement("br"));
      }
    }

    // inject to DOM
    tabDiv.appendChild(tabBtn);
    contentDiv.appendChild(contentContainer);
  }
}

function openTab(btn, contentId) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(contentId).style.display = "block";
  btn.className += " active";
}

createTabs();
