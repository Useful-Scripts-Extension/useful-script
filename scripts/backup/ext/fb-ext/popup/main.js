const sliderWaitTime = document.getElementById("slider-wait-time");
const spanWaitTime = document.getElementById("wait-time");
const inputMaxPosts = document.getElementById("max-posts");
const radioAction = document.getElementsByName("action");
const startBtn = document.getElementById("start-btn");

sliderWaitTime.value = localStorage.getItem("wait-time") || 3000;
spanWaitTime.innerHTML = renderTime(sliderWaitTime.value);
sliderWaitTime.oninput = function () {
  spanWaitTime.innerHTML = renderTime(this.value);
  localStorage.setItem("wait-time", this.value);
};

function renderTime(time) {
  return (time / 1000).toFixed(1) + "s";
}

async function main() {
  const tab = await getCurrentTab();

  if (!tab.url.includes("groups") || !tab.url.includes("spam")) {
    return prompt(
      "Bạn cần mở trang duyệt bài spam của group trước. Ví dụ:",
      "https://www.facebook.com/groups/gamecode/spam"
    );
  }

  startBtn.addEventListener("click", async () => {
    let action = radioAction[0].checked ? 1 : 2;
    let max = parseInt(inputMaxPosts.value);
    let wait = parseInt(sliderWaitTime.value);

    const currentTab = await getCurrentTab();
    runScriptInTab({
      target: { tabId: currentTab.id },
      func: start,
      args: [action, max, wait],
    });
  });
}

function start(action, max, wait) {
  const selector =
    action == 1
      ? '[role="main"] [aria-label="Đăng"]'
      : '[role="main"] [aria-label="Từ chối"]';

  if (max == 0) max = Infinity;

  const btns = Array.from(document.querySelectorAll(selector));
  onElementsAdded(selector, (nodes) => {
    for (let node of nodes) {
      if (btns.includes(node)) continue;
      btns.push(node);
    }
  });

  async function main() {
    let counter = 0;
    while (counter < max) {
      if (btns.length > 0) {
        const btn = btns.shift();

        btn.scrollIntoView({
          block: "center",
          //   behavior: "smooth",
        });
        console.log("click", btn);
        btn.click();

        counter++;
      }

      if (wait) await sleep(wait);
    }
    alert("Duyệt xong " + counter + " bài");
  }
  main();

  function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
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
}

async function getCurrentTab() {
  let tabs = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });
  return tabs[0];
}
const runScriptInTab = async (config = {}) => {
  return new Promise((resolve, reject) => {
    chrome.scripting.executeScript(
      mergeObject(
        {
          world: "MAIN",
          injectImmediately: true,
        },
        config
      ),
      (injectionResults) => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
          reject(chrome.runtime.lastError);
        }
        // https://developer.chrome.com/docs/extensions/reference/scripting/#handling-results
        else resolve(injectionResults?.find?.((_) => _.result)?.result);
      }
    );
  });
};
const mergeObject = (...objs) => {
  // merge without null value
  let res = {};
  for (let obj of objs) for (let key in obj) if (obj[key]) res[key] = obj[key];
  return res;
};

main();
