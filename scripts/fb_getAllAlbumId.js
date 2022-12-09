export default {
  name: {
    en: "Get all fb Album ID",
    vi: "Lấy tất cả fb album id",
  },
  description: {
    en: "Get all id of album in facebook website",
    vi: "Lấy tất cả album id có trong trang facebook",
  },
  blackList: [],
  whiteList: ["*://www.facebook.com"],

  onClick: function () {
    // Lấy tất cả album id có trong trang web - Khi đang xem 1 danh sách album của user/group/page

    const list_a = document.querySelectorAll("a");
    let list_id = [];
    for (let a of [location, ...Array.from(list_a)]) {
      const page_album_id = /(?<=\/photos\/a\.)(.\d+?)(?=\/)/.exec(a.href);
      if (page_album_id && page_album_id[0]) {
        list_id.push(page_album_id[0]);
      }
      const group_album_id = /(?<=set\=oa\.)(.\d+?)($|(?=&))/.exec(a.href);
      if (group_album_id && group_album_id[0]) {
        list_id.push(group_album_id[0]);
      }
      const user_album_id = /(?<=set\=a\.)(.\d+?)($|(?=&))/.exec(a.href);
      if (user_album_id && user_album_id[0]) {
        list_id.push(user_album_id[0]);
      }
    }
    // filter duplicate: https://stackoverflow.com/a/14438954
    list_id = [...new Set(list_id)];
    if (list_id.length)
      prompt(
        `Tìm thấy ${list_id.length} album id trong trang web và trên url.`,
        list_id.join(", ")
      );
    else
      prompt(
        "Không tìm thấy ALBUM ID nào trong trang web!\nBạn có đang ở đúng trang album chưa?\nTrang web Ví dụ:",
        "https://www.facebook.com/media/set/?vanity=ColourfulSpace&set=a.945632905514659"
      );
  },
};
