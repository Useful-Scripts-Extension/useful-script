import { runScriptInCurrentTab } from "./helpers/utils.js";
import scrollToVeryEnd from "./scrollToVeryEnd.js";

export default {
  icon: "",
  name: {
    en: "Test script",
    vi: "Test script",
  },
  description: {
    en: "",
    vi: "",
  },
  runInExtensionContext: false,

  func: async function () {
    function getOverlapScore(el) {
      var rect = el.getBoundingClientRect();
      return (
        Math.min(
          rect.bottom,
          window.innerHeight || document.documentElement.clientHeight
        ) - Math.max(0, rect.top)
      );
    }

    let videos = document.querySelectorAll("video");
    let urls = [];
    for (let video of videos) {
      let key = "";
      for (let k in video) {
        if (k.startsWith("__reactProps$")) {
          key = k;
          break;
        }
      }

      urls.push(video[key].src);
    }

    console.log(urls);
  },
};
