const waitMinInp = document.getElementById("inputWaitMin");
const waitMaxInp = document.getElementById("inputWaitMax");
const inputMaxPeople = document.getElementById("max-people");
const startBtn = document.getElementById("start-btn");

function initCacheInput(input, cacheName) {
  if (localStorage.getItem(cacheName)) {
    input.value = localStorage.getItem(cacheName);
  }
  input.addEventListener("input", () => {
    localStorage.setItem(cacheName, input.value);
  });
}

function renderTime(time, fixed = 1) {
  return (time / 1000).toFixed(fixed) + "s";
}

async function main() {
  initCacheInput(waitMinInp, "like-page-wait-min");
  initCacheInput(waitMaxInp, "like-page-wait-max");
  initCacheInput(inputMaxPeople, "like-page-max-people");

  const tab = await getCurrentTab();

  startBtn.addEventListener("click", async () => {
    const state = await getCurrentState(tab);
    if (state?.running) return stop(tab);

    let maxPeople = parseInt(inputMaxPeople.value);
    let waitMin = parseInt(waitMinInp.value) * 1000;
    let waitMax = parseInt(waitMaxInp.value) * 1000;

    runScriptInTab({
      target: { tabId: tab.id },
      func: start,
      args: [maxPeople, waitMin, waitMax],
    });
  });

  // check is running
  (async function checkIsRunning() {
    const state = await getCurrentState(tab);
    const { running, nextExecuteTime, count, action } = state || {};
    if (running) {
      startBtn.innerHTML =
        "Đang mời..." +
        count +
        " người (chờ " +
        renderTime(nextExecuteTime - Date.now(), 0) +
        ")<br/>(<i>Bấm để dừng</i>)";
      startBtn.classList.add("running");
    } else {
      startBtn.innerHTML = "Bắt đầu";
      startBtn.classList.remove("running");
    }
    setTimeout(checkIsRunning, 1000);
  })();
}

function getCurrentState(tab) {
  return runScriptInTab({
    target: { tabId: tab.id },
    func: () => window.fb_group_ext,
  });
}

function stop(tab) {
  runScriptInTab({
    target: { tabId: tab.id },
    func: () => {
      window.fb_group_ext.stop = true;
    },
  });
}

function start(maxPosts, waitMin, waitMax) {
  const selector = '[role="dialog"] [aria-label="Mời"]';

  if (maxPosts == 0) maxPosts = Infinity;

  const btns = Array.from(document.querySelectorAll(selector));

  if (!btns.length) {
    alert("Không tìm thấy người nào để mời");
    return;
  }

  onElementsAdded(selector, (nodes) => {
    for (let node of nodes) {
      if (btns.includes(node)) continue;
      btns.push(node);
    }
  });

  async function main() {
    window.fb_group_ext = {
      running: true,
      nextExecuteTime: 0,
      stop: false,
      count: 0,
    };

    let container;
    while (window.fb_group_ext.count < maxPosts && !window.fb_group_ext.stop) {
      if (btns.length > 0) {
        const btn = btns.shift();

        container = findParent(btn, ".html-div")?.children?.[0];
        console.log(container);

        btn.scrollIntoView({ block: "start", behavior: "smooth" });
        // console.log("click", btn);
        btn.click();

        window.fb_group_ext.count++;
        const waitTime = ranInt(waitMin, waitMax);
        window.fb_group_ext.nextExecuteTime = Date.now() + waitTime;
        await sleep(waitTime, () => window.fb_group_ext.stop);
      } else {
        // scroll to end
        if (container) container.scrollTo(0, container.scrollHeight);
        else window.scrollTo(0, document.body.scrollHeight);

        // wait for load more
        await sleep(1000);
      }
    }

    window.fb_group_ext.running = false;
    alert("Mời xong " + window.fb_group_ext.count + " người");
  }

  main();

  function findParent(ele, selector) {
    if (!ele) return null;
    if (ele.matches(selector)) return ele;
    return findParent(ele.parentElement, selector);
  }

  function ranInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  function sleep(time, cancelFn) {
    return new Promise((resolve) => {
      const timeout = setTimeout(resolve, time);
      if (cancelFn) {
        const interval = setInterval(() => {
          if (cancelFn()) {
            clearInterval(interval);
            clearTimeout(timeout);
            resolve();
          }
        }, 100);
      }
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
