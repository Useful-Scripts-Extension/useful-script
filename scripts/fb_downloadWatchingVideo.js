import { runScriptInCurrentTab } from "./helpers/utils.js";
import { parseXml, xml2json } from "./helpers/xmlParser.js";

export default {
  icon: '<i class="fa-solid fa-video"></i>',
  name: {
    en: "Facebook - Download watching video",
    vi: "Facebook - Tải video đang xem",
  },
  description: {
    en: "",
    vi: "",
  },
  blackList: [],
  whiteList: ["https://www.facebook.com/*"],
  runInExtensionContext: true,

  func: async function () {
    let listXml = await runScriptInCurrentTab(() => {
      // https://stackoverflow.com/a/7557433
      function isElementInViewport(el) {
        var rect = el.getBoundingClientRect();
        return !(
          rect.bottom < 0 ||
          rect.top >
            (window.innerHeight || document.documentElement.clientHeight)
        );
      }

      let allVideos = Array.from(document.querySelectorAll("video"));
      let result = [];
      for (let video of allVideos) {
        try {
          let key = "";
          for (let k in video.parentElement) {
            if (k.startsWith("__reactProps")) {
              key = k;
              break;
            }
          }
          result.push({
            inViewPort: isElementInViewport(video),
            xml: video.parentElement[key].children.props.manifest,
          });
          console.log(video, isElementInViewport(video));
        } catch (e) {
          console.log("ERROR on get video manifest: ", e);
        }
      }

      return result;
    });

    let urls = listXml
      .map(({ inViewPort, xml }) => {
        try {
          let json = JSON.parse(
            xml2json(parseXml(xml)).replace("undefined", "")
          );
          let urls = json.MPD.Period.AdaptationSet[0].Representation.map(
            (_) => ({
              quality: _["@FBQualityLabel"],
              url: _.BaseURL.replaceAll("&amp;", "&"),
            })
          );
          return {
            inViewPort,
            urls,
          };
        } catch (e) {
          return null;
        }
      })
      .filter((_) => _);

    console.log(urls);
  },
};

export const shared = {};
