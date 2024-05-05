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
    onClick: async () => {
      let ACCESS_TOKEN = prompt("Nhập access token của bạn vào đây");
      if (!ACCESS_TOKEN) return;

      let id = prompt("Nhập ID của user, group, page cần lấy group id", "");
      if (!id) return;

      fetch(
        `https://graph.facebook.com/v13.0/${id}/albums?fields=type,name,count,link,created_time&limit=100&access_token=${ACCESS_TOKEN}`
      )
        .then((res) => res.json())
        .then((json) => {
          console.log(json.data);
          alert(
            `Tìm được ${json.data?.length} algum.\nXem kết quả trong console của extension`
          );
        })
        .catch((err) => {
          console.log(err);
          alert("Có lỗi xảy ra: " + err);
        });
    },
  },
};
