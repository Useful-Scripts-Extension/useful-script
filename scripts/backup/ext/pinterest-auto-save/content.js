console.log("pinterest-auto-save loaded");

const cached = getCache();
let allBoardBtn,
  isAutoClick = false;

const saveAllBtn = document.createElement("button");
saveAllBtn.innerText = "Save to All boards";
saveAllBtn.onclick = async () => {
  if (!isAutoClick) {
    const fromIndex = prompt("From index?", cached?.lastSaveIndex || 0);
    setCache("lastSaveIndex", parseInt(fromIndex) || 0);
  }

  savingText.innerText =
    "Auto Saving to board " + ((cached?.lastSaveIndex || 0) + 1) + " ...";
  document.body.appendChild(overlay);

  allBoardBtn?.click?.();

  const selector = '[data-test-id*="board-row-"]';

  await waitForElements(selector);
  const boardRows = Array.from(document.querySelectorAll(selector));

  // remove all btns before "All boards" div
  const beforeAllBoard = [];
  while (boardRows.length > 0) {
    try {
      const next =
        boardRows[0].parentElement.parentElement.parentElement
          .nextElementSibling;
      const nextIsAllboard = next.textContent == "All boards";
      beforeAllBoard.push(boardRows.shift());
      if (nextIsAllboard) break;
    } catch (e) {
      console.log(e);
    }
  }

  onElementsAdded(selector, (nodes) => {
    for (let node of nodes) {
      if (boardRows.includes(node) || beforeAllBoard.includes(node)) continue;
      boardRows.push(node);
    }
  });

  const targetIndex = cached?.lastSaveIndex || 0;

  while (!boardRows[targetIndex]) {
    if (targetIndex > boardRows.length - 1) {
      focusTo(boardRows[boardRows.length - 1]);
      console.log("wait for load more...", boardRows.length, targetIndex);
      await sleep(1000);
      continue;
    }
  }

  const cur = boardRows[targetIndex];
  focusTo(cur);
  await sleep(1000);
  console.log("row to click", cur);

  // if save button appear -> click it
  const saveBtn = cur.querySelector('button[aria-label="save button"]');
  if (saveBtn) {
    clickSave(saveBtn, targetIndex);
  }
  // else -> click row
  else {
    cur.click();

    let done = false;
    while (!done) {
      const nodes = document.querySelectorAll(selector);
      const target = Array.from(nodes).find(
        (e) =>
          cur != e &&
          e.getAttribute("data-test-id") === cur.getAttribute("data-test-id") &&
          !beforeAllBoard.includes(e)
      );
      console.log(nodes, target);
      if (!target) {
        console.log("target not found, wait for load more...");
        await sleep(1000);
        continue;
      }
      focusTo(target);
      await sleep(1000);
      const saveBtn = target.querySelector('button[aria-label="save button"]');
      if (saveBtn) {
        clickSave(saveBtn, targetIndex);
        done = true;
      }
    }
  }
};

const overlay = document.createElement("div");
overlay.id = "pinterest-auto-save-overlay";

const savingText = document.createElement("h1");

const stopBtn = document.createElement("button");
stopBtn.innerText = "Stop auto save";
stopBtn.onclick = () => {
  isAutoClick = false;
  setCache("lastSaveIndex", 0);
  location.reload();
};
overlay.appendChild(savingText);
overlay.appendChild(stopBtn);

window.onload = async () => {
  console.log("cached", cached);
  // auto click if have last save
  if (cached?.lastSaveIndex) {
    await sleep(2000);
    isAutoClick = true;
    saveAllBtn.click();
  }
};

onElementsAdded(
  '[data-test-id="closeup-body"] button[aria-label="Select a board you want to save to"]',
  (nodes) => {
    if (nodes[0]) {
      console.log("add save all btn", nodes[0]);
      allBoardBtn = nodes[0];
      saveAllBtn.parentElement?.removeChild?.(saveAllBtn);
      allBoardBtn.parentElement.appendChild(saveAllBtn);
    }
  }
);

const cacheKey = "pinterest-auto-save";
function setCache(key, value) {
  const _ = JSON.parse(localStorage.getItem(cacheKey) || "{}");
  _[key] = value;
  for (const k in _) {
    cached[k] = _[k];
  }
  localStorage.setItem(cacheKey, JSON.stringify(_));
  return _;
}

function getCache(key) {
  const cached = JSON.parse(
    localStorage.getItem("pinterest-auto-save") || "{}"
  );
  if (key) return cached[key];
  return cached;
}

async function clickSave(btn, curIndex) {
  btn.click();

  // save progress to local storage
  setCache("lastSaveIndex", curIndex + 1);

  // reload page
  await sleep(3000);
  location.reload();
}

function focusTo(ele) {
  console.log("focus to", ele);
  if (!ele) return;
  ele.dispatchEvent(
    new MouseEvent("mouseover", {
      view: window,
      bubbles: true,
      cancelable: true,
    })
  );
  ele.scrollIntoView({ behavior: "smooth", block: "center" });
}

function escapeCssSelector(str, deep = true) {
  if (!deep) return str.replaceAll('"', '\\"');
  return str
    .replace(/\\/g, "\\\\") // Escape backslashes first
    .replace(/([!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~])/g, "\\$1") // Escape other special characters
    .replace(/\s/g, "\\ "); // Escape spaces
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function waitForElements(selector) {
  return new Promise((resolve, reject) => {
    onElementsAdded(selector, resolve, true);
  });
}

function onElementsAdded(selector, callback, once) {
  let nodes = document.querySelectorAll(selector);
  if (nodes?.length) {
    callback(nodes);
    if (once) return;
  }

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (!mutation.addedNodes) return;

      for (let node of mutation.addedNodes) {
        if (node.nodeType != 1) continue; // only process Node.ELEMENT_NODE

        let n = node.matches(selector)
          ? [node]
          : Array.from(node.querySelectorAll(selector));

        if (n?.length) {
          callback(n);
          if (once) observer.disconnect();
        }
      }
    });
  });

  observer.observe(document, {
    childList: true,
    subtree: true,
    attributes: false,
    characterData: false,
  });

  // return disconnect function
  return () => observer.disconnect();
}
