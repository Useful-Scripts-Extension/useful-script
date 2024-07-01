export default {
  icon: '<i class="fa-regular fa-window-restore fa-lg"></i>',
  name: {
    en: "Don't close browser with last tab",
    vi: "Không tắt trình duyệt khi tắt tab cuối",
  },
  description: {
    en: `Prevent closing of Browser after close the last tab<br/>
    Auto create new empty tab if no tab left`,
    vi: `Không tắt trình duyệt khi tắt tab cuối cùng<br/>
    Tự động mở tab mới khi bạn tắt tab cuối cùng`,
    img: "",
  },
  changeLogs: {
    "2024-05-22": "init",
  },

  popupScript: {
    onEnable: () => {
      chrome.runtime.sendMessage({ action: enableEvent });
    },
    onDisable: () => {
      chrome.runtime.sendMessage({ action: disableEvent });
    },
  },

  backgroundScript: {
    runtime: {
      onMessage: async ({ request, sender, sendResponse }, context) => {
        if (request.action === enableEvent) {
          onEnable();
        }
        if (request.action === disableEvent) {
          onDisable();
        }
      },
    },
    tabs: {
      onRemoved: (details, context) => {
        handleEvent("onRemoved");
      },
      onUpdated: (details, context) => {
        handleEvent("onUpdated");
      },
      onAttached: (details, context) => {
        handleEvent("onAttached");
      },
      onActivated: (details, context) => {
        handleEvent("onActivated");
      },
      onMoved: (details, context) => {
        handleEvent("onMoved");
      },
    },
  },
};

const enableEvent = "prevent_closeBrowser_lastTab_enabled";
const disableEvent = "prevent_closeBrowser_lastTab_disabled";

// https://chromewebstore.google.com/detail/dont-close-window-with-la/dlnpfhfhmkiebpnlllpehlmklgdggbhn
// ===================== bg script context =====================

let newTabUrl = "chrome://newtab/";
let working = false;
let handling = false;
let first_window_id = null;
let pinned_tab_id = null;

// config
let single_new_tab = false;
let new_tab_last = false;
let first_window = true;
let every_window = false;
let debug = false;

function isNewTabPage(url) {
  url = url.trim();
  return (
    url == newTabUrl ||
    url == "edge://newtab/" ||
    (url.indexOf("/_/chrome/newtab?") !== -1 && url.indexOf("google.") !== -1)
  );
}

async function onEnable() {
  first_window_id = null;
  pinned_tab_id = null;
  await handleEvent("onEnable");
}

async function onDisable() {
  if (pinned_tab_id) await chrome.tabs.remove(pinned_tab_id);
}

async function handleEvent(type) {
  if (handling) return;
  handling = true;

  if (debug) console.log("handleEvent " + type);
  let wasWorking = false;
  let windows = await chrome.windows.getAll({
    populate: true,
    windowTypes: ["normal"],
  });

  for (let win of windows) {
    let newTabs = await chrome.tabs.query({
      windowId: win.id,
      url: newTabUrl,
      pinned: false,
    });
    let pinnedTabs = await chrome.tabs.query({
      windowId: win.id,
      pinned: true,
    });
    if (win.tabs === undefined || win.tabs[0] === undefined) return;

    if (first_window_id == null) first_window_id = win.id;
    let firstTab = await chrome.tabs.get(win.tabs[0].id);

    // prevent activating first pinned tab
    if (win.tabs.length == 2) {
      if (
        win.tabs.length == 2 &&
        firstTab.active &&
        firstTab.pinned &&
        isNewTabPage(firstTab.url) &&
        !working
      ) {
        working = true;
        if (debug) console.log("activate tab 1");
        try {
          await chrome.tabs.update(win.tabs[1].id, { active: true });
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
      pinnedTabs.length < 1 &&
      !working
    ) {
      working = true;
      if (debug) console.log("creating pinned tab");
      try {
        let tab = await chrome.tabs.create({
          windowId: win.id,
          index: 0,
          pinned: true,
          active: false,
          url: newTabUrl,
        });
        pinned_tab_id = tab.id;
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
      pinnedTabs.length == 1 &&
      !working
    ) {
      working = true;
      if (debug) console.log("creating tab");
      try {
        await chrome.tabs.create({
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
      pinnedTabs.length < win.tabs.length &&
      pinnedTabs.length >= 1 &&
      isNewTabPage(firstTab.url) &&
      !working
    ) {
      working = true;
      if (debug) console.log("removing pinned tab 1");
      try {
        await chrome.tabs.remove(pinnedTabs[0].id);
        pinned_tab_id = null;
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
      pinnedTabs.length == 1 &&
      isNewTabPage(firstTab.url) &&
      !working
    ) {
      working = true;
      if (debug) console.log("unpin pinned tab");
      try {
        await chrome.tabs.update(pinnedTabs[0].id, {
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
      pinnedTabs.length == 1 &&
      isNewTabPage(firstTab.url) &&
      !working
    ) {
      working = true;
      if (debug) console.log("removing pinned tab 2");
      try {
        await chrome.tabs.remove(pinnedTabs[0].id);
        wasWorking = true;
      } catch (error) {
        console.log(error);
      }
      working = false;
    }
    // allow single new tab page
    if (
      single_new_tab &&
      newTabs.length > 1 &&
      /*windowPinnedTabs.length == 0 &&*/ !working
    ) {
      working = true;
      if (debug) console.log("removing tab");
      try {
        await chrome.tabs.remove(newTabs[0].id);
        wasWorking = true;
      } catch (error) {
        console.log(error);
      }
      working = false;
    }
    // prevent blank new tab page(s) before actual tabs with loaded pages
    if (
      new_tab_last &&
      pinnedTabs.length == 0 &&
      newTabs.length >= 1 &&
      win.tabs[win.tabs.length - 1].id != newTabs[0].id &&
      !working
    ) {
      working = true;
      if (debug) console.log("removing tab 2");
      try {
        await chrome.tabs.remove(newTabs[0].id);
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
