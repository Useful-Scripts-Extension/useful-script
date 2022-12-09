import { runScriptInCurrentTab, showLoading } from "./helpers/utils.js";
import { parseXml, xml2json } from "./helpers/xmlParser.js";
import { shared as fb_videoDownloader } from "./fb_videoDownloader.js";

export default {
  icon: "https://www.facebook.com/favicon.ico",
  name: {
    en: "Download watching fb video",
    vi: "Tải video fb đang xem",
  },
  description: {
    en: "Download facebook video that you are watching (watch/story/comment)",
    vi: "Tải video facebook bạn đang xem (watch/story/comment)",
  },
  blackList: [],
  whiteList: ["https://www.facebook.com/*"],
  runInExtensionContext: true,

  onClick: async function () {
    let { closeLoading, setLoadingText } = showLoading(
      "Đang lấy videoId từ trang web..."
    );
    try {
      let listVideoId = await shared.getListVideoIdInWebsite();
      let watchingVideoId = listVideoId[0];
      if (!watchingVideoId) throw Error("Không tìm thấy video nào");

      setLoadingText("Đang lấy token dtsg...");
      let dtsg = await fb_videoDownloader.getDtsg();

      setLoadingText("Đang tìm video url...");
      let videoUrl = await fb_videoDownloader.getLinkFbVideo2(
        watchingVideoId,
        dtsg
      );

      if (videoUrl) window.open(videoUrl);
      else throw Error("Không tìm được video link");
    } catch (e) {
      alert("ERROR: " + e);
    } finally {
      closeLoading();
    }
  },
};

export const shared = {
  getListVideoIdInWebsite: async function () {
    return await runScriptInCurrentTab(() => {
      function getOverlapScore(el) {
        var rect = el.getBoundingClientRect();
        return (
          Math.min(
            rect.bottom,
            window.innerHeight || document.documentElement.clientHeight
          ) - Math.max(0, rect.top)
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
            overlapScore: getOverlapScore(video),
            videoId: video.parentElement[key].children.props.videoFBID,
          });
        } catch (e) {
          console.log("ERROR on get videoFBID: ", e);
        }
      }

      return result
        .sort((a, b) => b.overlapScore - a.overlapScore)
        .map((_) => _.videoId);
    });
  },
};

async function backup() {
  // Get video urls from manifest (no audio)
  let listXml = await runScriptInCurrentTab(() => {
    // https://stackoverflow.com/a/7557433
    function isElementInViewport(el) {
      var rect = el.getBoundingClientRect();
      return !(
        rect.bottom < 0 ||
        rect.top > (window.innerHeight || document.documentElement.clientHeight)
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
      } catch (e) {
        console.log("ERROR on get video manifest: ", e);
      }
    }

    return result;
  });

  let urls = listXml
    .map(({ inViewPort, xml }) => {
      try {
        let json = JSON.parse(xml2json(parseXml(xml)).replace("undefined", ""));
        console.log(json);
        let urls = json.MPD.Period.AdaptationSet[0].Representation.map((_) => ({
          quality: _["@FBQualityLabel"],
          url: _.BaseURL.replaceAll("&amp;", "&"),
        }));
        return {
          inViewPort,
          urls,
        };
      } catch (e) {
        return null;
      }
    })
    .filter((_) => _ && _.inViewPort);

  console.log(urls);
}
