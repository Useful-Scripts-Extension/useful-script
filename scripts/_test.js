import {
  getCurrentTab,
  runScriptInTab,
  waitForTabToLoad,
} from "./helpers/utils.js";

export default {
  icon: "",
  name: {
    en: "Test",
    vi: "Test",
  },
  description: {
    en: "",
    vi: "",
  },

  // record audio when have stream: https://stackoverflow.com/a/34919194/23648002
  // https://www.youtube.com/watch?v=uk96O7N1Yo0
  // https://www.skilldrick.co.uk/fft/
  // https://stackoverflow.com/a/61301293/23648002
  // https://www.renderforest.com/music-visualisations
  // https://developer.chrome.com/docs/extensions/reference/api/tabCapture#preserving-system-audio
  // https://github.com/Douile/Chrome-Audio-Visualizer/tree/master
  // https://stackoverflow.com/questions/66217882/properly-using-chrome-tabcapture-in-a-manifest-v3-extension
  // https://groups.google.com/a/chromium.org/g/chromium-extensions/c/ffI0iNd79oo
  // https://github.dev/GoogleChrome/chrome-extensions-samples/api-samples/tabCapture

  onClick: async () => {
    // https://developer.chrome.com/docs/extensions/how-to/web-platform/screen-capture
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: {
        displaySurface: "browser",
      },
      audio: {
        suppressLocalAudioPlayback: false,
      },
      preferCurrentTab: false,
      selfBrowserSurface: "exclude",
      systemAudio: "include",
      surfaceSwitching: "include",
      monitorTypeSurfaces: "include",
    });

    drawVisualizer(stream);

    // const streamId = await UfsGlobal.Extension.runInBackground(
    //   "chrome.tabCapture.getMediaStreamId"
    // );
    // navigator.webkitGetUserMedia(
    //   {
    //     audio: {
    //       mandatory: {
    //         chromeMediaSource: "tab", // The media source must be 'tab' here.
    //         chromeMediaSourceId: streamId,
    //       },
    //     },
    //     video: false,
    //   },
    //   function (stream) {
    //     console.log(stream);
    //   },
    //   function (error) {
    //     console.error(error);
    //   }
    // );
  },

  _onClickExtension: async () => {
    try {
      // const url = "http://127.0.0.1:5500/public/music-visualizer/index.html";
      const url = await chrome.runtime.getURL(
        "/public/music-visualizer/index.html"
      );
      const currentTab = await getCurrentTab();
      const newTab = await chrome.tabs.create({
        url: url,
        active: false,
      });
      await waitForTabToLoad(newTab.id);

      const streamId = await chrome.tabCapture.getMediaStreamId({
        targetTabId: currentTab.id,
        consumerTabId: newTab.id,
      });

      chrome.tabs.update(newTab.id, {
        url: url + "?streamId=" + streamId,
      });

      // runScriptInTab({
      //   tabId: newTab.id,
      //   func: (streamId) => {
      //     start(streamId);
      //   },
      //   args: [streamId],
      // });
    } catch (e) {
      alert(e);
    }
  },

  _onClickContentScript: async () => {
    try {
      const currentTabId = await UfsGlobal.Extension.runInBackground(
        "utils.getCurrentTabId"
      );

      const url = await UfsGlobal.Extension.getURL("/scripts/_test.html");
      const { tabs } = await UfsGlobal.Extension.runInBackground(
        "chrome.windows.create",
        [{ url, height: 400, width: 800 }]
      );
      const tab = tabs[0];

      await UfsGlobal.Extension.waitForTabToLoad(tab.id);

      UfsGlobal.Extension.runInBackground("chrome.tabs.sendMessage", [
        tab.id,
        {
          targetTabId: currentTabId,
          consumerTabId: tab.id,
        },
      ]);
    } catch (e) {
      console.log(e);
    }
  },
};
