export default {
  icon: '<i class="fa-solid fa-link fa-lg"></i>',
  name: {
    en: "Get fb User ID from url",
    vi: "Lấy fb User ID từ URL",
  },
  description: {
    en: "Get id of facebook user from entered url",
    vi: "Lấy id của facebook user từ URL truyền vào",
  },

  popupScript: {
    onClick: async function () {
      const { getUidFromUrl } = await import("./fb_GLOBAL.js");

      // Lấy UID từ url của user fb. Ví dụ: https://www.facebook.com/99.hoangtran
      const url = prompt("Nhập url của user fb:", "");
      if (url) {
        getUidFromUrl(url)
          .then((uid) => {
            if (uid) prompt(`UID của user ${url}:`, uid);
            else alert("Không tìm thấy uid của user!");
          })
          .catch((err) => alert("Lỗi: " + err.message));
      }
    },
  },
};
