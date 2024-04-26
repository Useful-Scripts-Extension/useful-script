import { runScriptInTab, waitForTabToLoad } from "./helpers/utils.js";

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
  // https://developer.chrome.com/docs/extensions/how-to/web-platform/screen-capture

  onClickExtension: async () => {
    const { tabs } = await chrome.windows.create({
      url: "http://127.0.0.1:5500/public/music-visualizer/index.html",
      type: "popup",
      width: 800,
      height: 300,
    });
    const tab = tabs[0];

    await waitForTabToLoad(tab.id);

    runScriptInTab({
      func: () => {
        window.ufs_call_init?.();
      },
      tabId: tab.id,
    });
  },
};
