import { runScriptInCurrentTab, showLoading } from "./helpers/utils.js";
import { shared as tiktok_downloadWatchingVideo } from "./tiktok_downloadWatchingVideo.js";

export default {
  icon: "https://www.tiktok.com/favicon.ico",
  name: {
    en: "Tiktok - Download video (API)",
    vi: "Tiktok - Tải video (API)",
  },
  description: {
    en: "Download tiktok video from url (no/have watermark)",
    vi: "Tải video tiktok từ link (không/có watermark)",
  },
  runInExtensionContext: true,

  onClick: async function () {
    let url = prompt(
      "Nhập link tiktok video: ",
      await runScriptInCurrentTab(() => location.href)
    );
    if (url == null) return;

    let watermark = prompt("Lấy video watermark?\n 0: Không\n 1: Có", 0);

    let { closeLoading } = showLoading(
      "Đang lấy link video không watermark..."
    );
    try {
      let link = "";
      if (watermark == "0") {
        link = await shared.getVideoNoWaterMark(url);
        if (link) window.open(link);
        else throw Error("Không tìm được video không watermark");
      } else {
        link = await shared.getVideoWaterMark(url);
        if (link) await tiktok_downloadWatchingVideo.renderVideoInWeb(link);
        else throw Error("Không tìm được video không watermark");
      }
    } catch (e) {
      alert("ERROR: " + e);
    } finally {
      closeLoading();
    }
  },
};

export const shared = {
  // Source code: https://github.com/karim0sec/tiktokdl
  getVideoId: function (url) {
    if (url.includes("@") && url.includes("/video/"))
      return url.split("/video/")[1].split("?")[0];
    throw Error("URL video tiktok không đúng địng dạng");
  },

  getVideoNoWaterMark: async function (video_url, isVideoId = false) {
    let videoId = isVideoId ? video_url : shared.getVideoId(video_url);
    if (!videoId) throw Error("Video URL không đúng định dạng");

    let API_URL = `https://api19-core-useast5.us.tiktokv.com/aweme/v1/feed/?aweme_id=${videoId}&version_code=262&app_name=musical_ly&channel=App&device_id=null&os_version=14.4.2&device_platform=iphone&device_type=iPhone9`;
    let request = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "User-Agent":
          "TikTok 26.2.0 rv:262018 (iPhone; iOS 14.4.2; en_US) Cronet",
      },
    });
    let res = await request.json();
    console.log(res);
    let url = res.aweme_list[0].video.play_addr.url_list[0];
    return url;
  },

  // https://github.com/soimort/you-get/blob/develop/src/you_get/extractors/tiktok.py
  getVideoWaterMark: async function (video_url) {
    // let res = await openWebAndRunScript({
    //   video_url,
    //   closeAfterRunScript: true,
    //   focusAfterRunScript: false,
    //   func: () => {
    //     return window.SIGI_STATE;
    //   },
    // });

    let res = await fetch(video_url);
    let html = await res.text();

    // prettier-ignore
    let data = new RegExp('window\[\'SIGI_STATE\'\]=(.*?);window\[\'SIGI_RETRY\'\]').exec(html)?.[1] ||
              new RegExp('<script id="SIGI_STATE" type="application/json">(.*?)</script>').exec(html)?.[1];
    let json = JSON.parse(data);
    let vid = Object.keys(json.ItemModule)?.[0];
    let vdata = json.ItemModule[vid];

    let url = vdata?.video?.downloadAddr || vdata?.video?.playAddr;
    let author = vdata?.author;
    let nickname = json?.UserModule?.users?.author?.nickname;

    // return { url, author, nickname };
    return url;
  },
};
