export default {
  name: {
    en: "Get User ID from url",
    vi: "Lấy User ID từ URL",
  },
  description: {
    en: "Get id of user from entered url",
    vi: "Lấy id của user từ URL truyền vào",
  },

  // Lấy UID từ url của user fb. Ví dụ: https://www.facebook.com/99.hoangtran
  func: function () {
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
    const url = window.prompt("Nhập url của user fb:", "");
    if (url)
      _getUidFromUrl(url)
        .then((uid) => {
          if (uid) window.prompt(`UID của user ${url}:`, uid);
          else alert("Không tìm thấy uid của user!");
        })
        .catch((err) => alert("Lỗi: " + err.message));
  },
};
