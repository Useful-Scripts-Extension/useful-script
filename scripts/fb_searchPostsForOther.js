import { BADGES } from "./helpers/badge.js";

export default {
  icon: '<i class="fa-regular fa-newspaper fa-lg"></i>',
  name: {
    en: "Facebook - Find all posts of your friends",
    vi: "Facebook - Tìm mọi bài viết của bạn bè",
  },
  description: {
    en: "Search all public posts of your friends on facebook. Include posts in group, page, wall, ...",
    vi: "Tìm tất cả bài posts công khai của bạn bè trên facebook. Bao gồm bài post trong group, page, trên tường, ...",
  },
  badges: [BADGES.new],
  infoLink:
    "https://anonyviet.com/cach-tim-tat-ca-bai-viet-cua-nguoi-khac-tren-facebook/",

  changeLogs: {
    "2024-05-02": "init",
  },

  popupScript: {
    onClick: async () => {
      const { getUidFromUrl } = await import("./fb_GLOBAL.js");
      const { showLoading } = await import("./helpers/utils.js");
      let friendUrl = prompt("Nhập link fb bạn bè: ");

      if (friendUrl) {
        let keyword = prompt("Nhập từ khoá tìm kiếm: ");
        if (keyword == null) return;

        const { closeLoading } = showLoading("Đang tìm uid...");
        let uid = await getUidFromUrl(friendUrl);
        closeLoading();

        let str = `{"rp_author:0":"{\\"name\\":\\"author\\",\\"args\\":\\"${uid}\\"}"}`;
        let base64 = btoa(str);
        let url = `https://www.facebook.com/search/posts/?q=${encodeURI(
          keyword
        )}&filters=${encodeURI(base64)}`;
        window.open(url);
      }
    },
  },
};
