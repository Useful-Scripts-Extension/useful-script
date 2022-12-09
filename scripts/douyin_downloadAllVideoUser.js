import { downloadData, getCurrentTab, showLoading } from "./helpers/utils.js";

export default {
  icon: "https://www.douyin.com/favicon.ico",
  name: {
    en: "Douyin - Download all user videos",
    vi: "Douyin - Tải tất cả video người dùng",
  },
  description: {
    en: "Download all videos in douyin user profile.",
    vi: "Tải tất cả video trong trang cá nhân của người dùng douyin.",
  },
  runInExtensionContext: true,

  onClick: async function () {
    let { closeLoading, setLoadingText } = showLoading("Đang tìm uid...");
    try {
      let tab = await getCurrentTab();
      let uid =
        shared.extractUidFromUrl(tab.url) ||
        shared.extractUidFromUrl(
          prompt(
            "Nhập link douyin user:\n" +
              "Ví dụ: https://www.douyin.com/user/ABCXYZ..."
          )
        );
      if (!uid) return;

      setLoadingText(`Đang thu thập thông tin...`);
      let max_cursor = 0;
      let all_data = [];
      while (1) {
        let postData = await shared.getUserPostData(uid, max_cursor);
        let [data, cursor] = await shared.parseUserPostData(postData);
        max_cursor = cursor;
        all_data.push(...data);
        setLoadingText(
          `Đang thu thập douyin videos... (${all_data.length} video)`
        );
        if (!max_cursor) break;
      }
      console.log(all_data);
      downloadData(
        all_data.map((_) => _.src).join("\n"),
        "douyin_" + uid,
        "txt"
      );
    } catch (e) {
      alert("ERROR: " + e);
    } finally {
      closeLoading();
    }
  },
};

export const shared = {
  // Original source code from: https://github.com/N-X-T/Download-All-Video-User-Douyin/blob/main/DownloadAllVideoDouyin.js?fbclid=IwAR3ne_fDNpRpduM23kLJxOpDaQjI2-V3CA3iZ0BA0gvCgGdnMCfemyoMyO8
  // Modified by Hoang Tran
  getUserPostData: async function (uid, max_cursor) {
    let API_ENDPOINT =
      "https://www.iesdouyin.com/web/api/v2/aweme/post/?sec_uid=" +
      uid +
      "&count=10&max_cursor=" +
      max_cursor;
    let data = await fetch(API_ENDPOINT, {
      headers: {
        accept: "application/json",
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko)",
      },
      method: "GET",
    });
    data = await data.json();
    return data;
  },
  parseUserPostData: async function (postData) {
    let data = postData.aweme_list.map((item) => ({
      id: item.aweme_id,
      src: item.video.play_addr.url_list[0],
      desc: item.desc,
    }));

    if (postData["has_more"] || postData["aweme_list"].length != 0)
      return [data, postData["max_cursor"]];
    else return [data, 0];
  },
  extractUidFromUrl: function (url) {
    return /https:\/\/www\.douyin\.com\/user\/([^?]+)/gm.exec(url)?.[1];
  },
};
