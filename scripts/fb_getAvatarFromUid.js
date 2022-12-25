import { downloadData, showLoading } from "./helpers/utils.js";
import { AccessToken } from "./helpers/constants.js";

export default {
  icon: '<i class="fa-solid fa-user fa-lg"></i>',
  name: {
    en: "Get avatar from fb user id",
    vi: "Tải avatar từ fb user id",
  },
  description: {
    en: "Get avatar from list facebook user ids",
    vi: "Tải danh sách avatar từ danh sách user id facebook",
  },

  onClickExtension: async function () {
    let uids = prompt("Nhập danh sách uid, Mỗi uid 1 dòng:");
    if (!uids) return;

    const { closeLoading, setLoadingText } = showLoading();
    try {
      uids = uids.split("\n");
      let urls = [];
      for (let uid of uids) {
        setLoadingText("Đang lấy avatar của " + uid + "...");
        let url = await shared.getAvatarFromUid(uid);
        if (url) {
          urls.push(url);
        }
      }

      if (urls.length === 0) alert("Không tìm được avatar nào!");
      else if (urls.length === 1) window.open(urls[0]);
      else {
        if (
          confirm("Tìm được " + urls.length + " avatars.\nBấm Ok để tải xuống.")
        )
          downloadData(
            urls.join("\n"),
            `uid-${new Date().toLocaleString()}.txt`
          );
      }
    } catch (e) {
      alert("ERROR: " + e);
    } finally {
      closeLoading();
    }
  },
};

export const shared = {
  getAvatarFromUid: async (uid) => {
    let url = `https://graph.facebook.com/${uid}/picture?height=500&access_token=${AccessToken.FacebookIphone}`;
    let data = await fetch(url);
    return data.url;
  },
};
