const waitMinInp = document.getElementById("inputWaitMin");
const waitMaxInp = document.getElementById("inputWaitMax");
const inputMaxPosts = document.getElementById("max-posts");
const radioAction = document.getElementsByName("action");
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
  initCacheInput(waitMinInp, "wait-min");
  initCacheInput(waitMaxInp, "wait-max");
  initCacheInput(inputMaxPosts, "max-posts");

  const tab = await getCurrentTab();

  if (!tab.url.includes("groups") || !tab.url.includes("spam")) {
    return prompt(
      "\n\nBạn cần mở trang duyệt bài spam của group trước.\n\nLink hiện tại:" +
        tab.url +
        "\nLink đúng ví dụ:",
      "https://www.facebook.com/groups/gamecode/spam"
    );
  }

  startBtn.addEventListener("click", async () => {
    const state = await getCurrentState(tab);
    if (state?.running) {
      return stop(tab);
    }

    let action = radioAction[0].checked ? 1 : 2;
    let maxPosts = parseInt(inputMaxPosts.value);
    let waitMin = parseInt(waitMinInp.value) * 1000;
    let waitMax = parseInt(waitMaxInp.value) * 1000;

    if (waitMin > waitMax) {
      return alert(
        "Thời gian chờ không hợp lệ\nBên trái phải bé hơn hoặc bằng bên phải"
      );
    }

    runScriptInTab({
      target: { tabId: tab.id },
      func: start,
      args: [action, maxPosts, waitMin, waitMax],
    });
  });

  // check is running
  (async function checkIsRunning() {
    const state = await getCurrentState(tab);
    const { running, nextExecuteTime, count, action } = state || {};
    if (running) {
      startBtn.innerHTML =
        "Đang " +
        (action === 1 ? "đăng" : "từ chối") +
        "... " +
        count +
        " bài (chờ " +
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

function start(action, maxPosts, waitMin, waitMax) {
  const selector =
    action == 1
      ? '[role="main"] [aria-label="Đăng"]'
      : '[role="main"] [aria-label="Từ chối"]';

  if (maxPosts == 0) maxPosts = Infinity;

  const btns = Array.from(document.querySelectorAll(selector));

  if (!btns.length) {
    alert("Không tìm thấy bài nào");
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
      action,
      running: true,
      nextExecuteTime: 0,
      stop: false,
      count: 0,
    };

    while (window.fb_group_ext.count < maxPosts && !window.fb_group_ext.stop) {
      if (btns.length > 0) {
        const btn = btns.shift();

        btn.scrollIntoView({ block: "center", behavior: "smooth" });
        console.log("click", btn);
        btn.click();

        window.fb_group_ext.count++;
        const waitTime = ranInt(waitMin, waitMax);
        window.fb_group_ext.nextExecuteTime = Date.now() + waitTime;
        await sleep(waitTime, () => window.fb_group_ext.stop);
      } else {
        // scroll to end
        window.scrollTo(0, document.body.scrollHeight);
        // wait for load more
        await sleep(1000);
      }
    }

    window.fb_group_ext.running = false;
    alert("Duyệt xong " + window.fb_group_ext.count + " bài");
  }

  main();

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
