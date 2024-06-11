export default {
  icon: '<i class="fa-solid fa-circle-info fa-lg"></i>',
  name: {
    en: "Get all albums information",
    vi: "Lấy thông tin tất cả album",
  },
  description: {
    en: "Get all albums information from user, group, page (id, count, link, ...)",
    vi: "Lấy thông tin tất cả album từ user, group, page (id, số lượng, link, ...)",
  },

  popupScript: {
    onClick: () => {
      let ACCESS_TOKEN = prompt("Nhập access token của bạn vào đây");
      if (!ACCESS_TOKEN) return;

      let id = prompt("Nhập ID của user, group, page cần lấy albums", "");
      if (!id) return;

      fb_getAllAlbumInfos(id, ACCESS_TOKEN)
        .then((result) => {
          console.log(result);
          prompt(
            `Tìm được ${result?.length} albums:\n` +
              result.map((_) => _.name + ": " + _.count).join("\n") +
              "\n\nCopy ngay:",
            JSON.stringify(result)
          );
        })
        .catch((err) => {
          console.log(err);
          alert("Có lỗi xảy ra: " + err);
        });
    },
  },
};

export async function fb_getAllAlbumInfos(id, access_token) {
  let result = [];
  let after = "";
  while (true) {
    try {
      const res = await fetch(
        `https://graph.facebook.com/v20.0/${id}/albums?fields=type,name,count,link,created_time&limit=100&access_token=${access_token}&after=${after}`
      );
      const json = await res.json();
      if (json.data) result = result.concat(json.data);

      let nextAfter = json.paging?.cursors?.after;
      if (!nextAfter || nextAfter === after) break;
      after = nextAfter;
    } catch (e) {
      break;
    }
  }
  return result;
}
