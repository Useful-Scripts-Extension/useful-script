export default {
  icon: `<i class="fa-solid fa-images fa-lg"></i>`,
  name: {
    en: "Get fb Album ID",
    vi: "Lấy fb Album ID",
  },
  description: {
    en: "Get id of facebook album in current website",
    vi: "Lấy id của facebook album trong trang web hiện tại",
  },
  whiteList: ["https://*.facebook.com/*"],

  pageScript: {
    onClick: function () {
      // Lấy album id - khi đang xem 1 album, ví dụ https://www.facebook.com/media/set/?vanity=ColourfulSpace&set=a.945632905514659

      const list_a = document.querySelectorAll("a");
      for (let a of [location, ...Array.from(list_a)]) {
        const page_album_id = /(?<=\/photos\/a\.)(.\d+?)(?=\/)/.exec(a.href);
        if (page_album_id && page_album_id[0]) {
          prompt("PAGE ALBUM ID:", page_album_id[0]);
          return;
        }
        const group_album_id = /(?<=set\=oa\.)(.\d+?)($|(?=&))/.exec(a.href);
        if (group_album_id && group_album_id[0]) {
          prompt("GROUP ALBUM ID:", group_album_id[0]);
          return;
        }
        const user_album_id = /(?<=set\=a\.)(.\d+?)($|(?=&))/.exec(a.href);
        if (user_album_id && user_album_id[0]) {
          prompt("USER ALBUM ID:", user_album_id[0]);
          return;
        }
      }
      prompt(
        "Không tìm thấy ALBUM ID nào trong trang web!\nBạn có đang ở đúng trang album chưa?\nTrang web Ví dụ:",
        "https://www.facebook.com/media/set/?vanity=ColourfulSpace&set=a.945632905514659"
      );
    },
  },
};
