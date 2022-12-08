import { runScriptInCurrentTab, showLoading } from "./helpers/utils.js";

export default {
  icon: "https://www.tiktok.com/favicon.ico",
  name: {
    en: "Tiktok - Download video (API)",
    vi: "Tiktok - Tải video (API)",
  },
  description: {
    en: "Download tiktok video from url (no watermark)",
    vi: "Tải video tiktok từ link (không watermark)",
  },
  runInExtensionContext: true,

  onClick: async function () {
    let url = prompt(
      "Nhập link tiktok video: ",
      await runScriptInCurrentTab(() => location.href)
    );
    if (url == null) return;

    let { closeLoading } = showLoading(
      "Đang lấy link video không watermark..."
    );
    try {
      let videoNoWM = await shared.getVideoNoWaterMark(url);
      if (videoNoWM) window.open(videoNoWM);
      else throw Error("Không tìm được video không watermark");
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
};
