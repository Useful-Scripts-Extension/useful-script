export default {
  icon: '<i class="fa-regular fa-window-restore fa-lg"></i>',
  name: {
    en: "Don't close browser with last tab",
    vi: "Không tắt trình duyệt khi tắt tab cuối",
  },
  description: {
    en: `Prevent closing of Browser after close the last tab<br/>
    Auto create new empty tab if no tab left<br/>
    (only if last tab is not empty tab)`,
    vi: `Không tắt trình duyệt khi tắt tab cuối cùng<br/>
    Tự động mở tab mới khi bạn tắt tab cuối cùng<br/>
    (chỉ chạy nếu tab cuối cùng bạn tắt không phải tab trống)`,
    img: "",
  },

  changeLogs: {
    "2024-05-22": "init",
  },

  backgroundScript: {
    tabs: {
      onRemoved: (details, context) => {
        handleEvent("onRemoved", context);
      },
      onUpdated: (details, context) => {
        handleEvent("onUpdated", context);
      },
      onAttached: (details, context) => {
        handleEvent("onAttached", context);
      },
      onActivated: (details, context) => {
        handleEvent("onActivated", context);
      },
      onMoved: (details, context) => {
        handleEvent("onMoved", context);
      },
    },
  },
};

const newTabUrl = "chrome://newtab/";
const rootKey = "prevent_closeBrowser_lastTab";
const handlingKey = rootKey + ".handling";
const lastActiveTabKey = rootKey + ".lastActiveTab";
const pinnedTabKey = rootKey + ".pinnedTab";

function isNewTabPage(url) {
  url = url.trim();
  return (
    url == newTabUrl ||
    url == "edge://newtab/" ||
    (url.indexOf("/_/chrome/newtab?") !== -1 && url.indexOf("google.") !== -1)
  );
}

async function handleEvent(type, context) {
  if (context.getCache(handlingKey, false)) return;
  context.setCache(handlingKey, true);

  let pinnedTabId = context.getCache(pinnedTabKey);
  let lastActiveTabId = context.getCache(lastActiveTabKey);

  let tabs = await chrome.tabs.query({});
  let pinnedTab = tabs.find((tab) => tab.id == pinnedTabId);
  console.log("handleEvent", type, tabs, pinnedTab);

  // prevent activating first pinned tab
  let activeTab = tabs.find((tab) => tab.active);
  if (activeTab?.id == pinnedTab.id) {
    await chrome.tabs.update(lastActiveTabId, {
      active: true,
    });
  } else {
    context.setCache(lastActiveTabKey, activeTab?.id);
  }

  // create the single pinned tab if there's none
  if (!pinnedTab && tabs.length == 1) {
    let pinned = await chrome.tabs.create({
      url: newTabUrl,
      pinned: true,
      active: false,
    });
    context.setCache(pinnedTabKey, pinned.id);
  }

  // open new tab if there's only single pinned tab
  if (pinnedTab && tabs.length == 1) {
    await chrome.tabs.create({
      url: newTabUrl,
      pinned: false,
      active: false,
    });
  }

  // remove pinned tab if there's enough open tabs
  if (pinnedTab && tabs.length > 1) {
    await chrome.tabs.remove(pinnedTab.id);
  }

  context.setCache(handlingKey, false);
}

async function _handleEvent(type, context) {
  if (handling) return;
  handling = true;

  if (debug) console.log("handleEvent " + type);
  let wasWorking = false;
  let windows = await chrome.windows.getAll({
    populate: true,
    windowTypes: ["normal"],
  });
  for (let i = 0; i < windows.length; i++) {
    let win = windows[i];
    let windowNewTabs = await browser.tabs.query({
      windowId: win.id,
      url: newTabUrl,
      pinned: false,
    });
    let windowPinnedTabs = await chrome.tabs.query({
      windowId: win.id,
      pinned: true,
    });
    if (win.tabs === undefined || win.tabs[0] === undefined) return;
    let windowFirstTab = await browser.tabs.get(win.tabs[0].id);
    if (first_window_id == null) first_window_id = win.id;

    // prevent activating first pinned tab
    if (win.tabs.length == 2) {
      if (
        win.tabs.length == 2 &&
        windowFirstTab.active &&
        windowFirstTab.pinned &&
        isNewTabPage(windowFirstTab.url) &&
        !working
      ) {
        working = true;
        if (debug) console.log("activate tab 1");
        try {
          await browser.tabs.update(win.tabs[1].id, {
            active: true,
          });
          wasWorking = true;
        } catch (error) {
          setTimeout(function () {
            handleEvent("redo");
          }, 50);
        }
        working = false;
      }
    }
    // create the single pinned tab if there's none
    if (
      (every_window ||
        windows.length == 1 ||
        (first_window && first_window_id == win.id)) &&
      win.tabs.length < 2 &&
      windowPinnedTabs.length < 1 &&
      !working
    ) {
      working = true;
      if (debug) console.log("creating pinned tab");
      try {
        await browser.tabs.create({
          windowId: win.id,
          index: 0,
          pinned: true,
          active: false,
          url: newTabUrl,
        });
        first_window_id = win.id;
        wasWorking = true;
      } catch (error) {
        setTimeout(function () {
          handleEvent("redo");
        }, 700);
      }
      working = false;
    }
    // open new tab if there's only single pinned tab
    if (
      (every_window ||
        windows.length == 1 ||
        (first_window && first_window_id == win.id)) &&
      win.tabs.length == 1 &&
      windowPinnedTabs.length == 1 &&
      !working
    ) {
      working = true;
      if (debug) console.log("creating tab");
      try {
        await browser.tabs.create({
          windowId: win.id,
          url: newTabUrl,
        });
        first_window_id = win.id;
        wasWorking = true;
      } catch (error) {
        setTimeout(function () {
          handleEvent("redo");
        }, 700);
      }
      working = false;
    }
    // remove pinned tab if there's enough open tabs
    if (
      (every_window ||
        windows.length == 1 ||
        (first_window && first_window_id == win.id)) &&
      win.tabs.length > 2 &&
      windowPinnedTabs.length < win.tabs.length &&
      windowPinnedTabs.length >= 1 &&
      isNewTabPage(windowFirstTab.url) &&
      !working
    ) {
      working = true;
      if (debug) console.log("removing pinned tab 1");
      try {
        await browser.tabs.remove(windowPinnedTabs[0].id);
        wasWorking = true;
      } catch (error) {
        setTimeout(function () {
          handleEvent("redo");
        }, 700);
      }
      working = false;
    }
    // unpin single pinned tab if there's another window
    if (
      !every_window &&
      windows.length > 1 &&
      !(first_window && first_window_id == win.id) &&
      win.tabs.length == 1 &&
      windowPinnedTabs.length == 1 &&
      isNewTabPage(windowFirstTab.url) &&
      !working
    ) {
      working = true;
      if (debug) console.log("unpin pinned tab");
      try {
        await browser.tabs.update(windowPinnedTabs[0].id, {
          pinned: false,
        });
        wasWorking = true;
      } catch (error) {
        console.log(error);
      }
      working = false;
    }
    // remove pinned tab if 1st window has at least one regular page and new window is openning (ctrl+n)
    if (
      !every_window &&
      windows.length > 1 &&
      !(first_window && first_window_id == win.id) &&
      win.tabs.length == 2 &&
      windowPinnedTabs.length == 1 &&
      isNewTabPage(windowFirstTab.url) &&
      !working
    ) {
      working = true;
      if (debug) console.log("removing pinned tab 2");
      try {
        await browser.tabs.remove(windowPinnedTabs[0].id);
        wasWorking = true;
      } catch (error) {
        console.log(error);
      }
      working = false;
    }
    // allow single new tab page
    if (
      single_new_tab &&
      windowNewTabs.length > 1 &&
      /*windowPinnedTabs.length == 0 &&*/ !working
    ) {
      working = true;
      if (debug) console.log("removing tab");
      try {
        await browser.tabs.remove(windowNewTabs[0].id);
        wasWorking = true;
      } catch (error) {
        console.log(error);
      }
      working = false;
    }
    // prevent blank new tab page(s) before actual tabs with loaded pages
    if (
      new_tab_last &&
      windowPinnedTabs.length == 0 &&
      windowNewTabs.length >= 1 &&
      win.tabs[win.tabs.length - 1].id != windowNewTabs[0].id &&
      !working
    ) {
      working = true;
      if (debug) console.log("removing tab 2");
      try {
        await browser.tabs.remove(windowNewTabs[0].id);
        wasWorking = true;
      } catch (error) {
        setTimeout(function () {
          handleEvent("redo");
        }, 700);
      }
      working = false;
    }
  }
  if (debug) console.log("end handleEvent");
  handling = false;
  if (wasWorking)
    setTimeout(function () {
      handleEvent("redo");
    }, 50);
}
