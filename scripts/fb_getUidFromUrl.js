import { showLoading } from "./helpers/utils.js";

export default {
  name: {
    en: "Get fb User ID from url",
    vi: "Lấy fb User ID từ URL",
  },
  description: {
    en: "Get id of facebook user from entered url",
    vi: "Lấy id của facebook user từ URL truyền vào",
  },
  runInExtensionContext: true,

  onClick: function () {
    // Lấy UID từ url của user fb. Ví dụ: https://www.facebook.com/99.hoangtran

    const _getUidFromUrl = async (url) => {
      var response = await fetch(url);
      if (response.status == 200) {
        var text = await response.text();
        let uid = /(?<=\"userID\"\:\")(.\d+?)(?=\")/.exec(text);
        if (uid?.length) {
          return uid[0];
        }
      }
      return null;
    };
    const url = prompt("Nhập url của user fb:", "");
    if (url) {
      const { closeLoading } = showLoading("Đang lấy UID của " + url);
      _getUidFromUrl(url)
        .then((uid) => {
          if (uid) prompt(`UID của user ${url}:`, uid);
          else alert("Không tìm thấy uid của user!");
        })
        .catch((err) => alert("Lỗi: " + err.message))
        .finally(closeLoading);
    }
  },
};
