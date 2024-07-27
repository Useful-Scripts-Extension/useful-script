export default {
  icon: "https://cdn-icons-png.flaticon.com/512/5968/5968906.png",
  name: {
    en: "Read full medium article",
    vi: "Đọc bài viết medium full",
  },
  description: {
    en: "Read full medium article without login",
    vi: "Đọc bài viết medium full không cần đăng nhập",
  },

  // whiteList: ["https://medium.com/*"],

  popupScript: {
    onClick: async () => {
      const { getCurrentTabUrl } = await import("./helpers/utils.js");
      let url = await getCurrentTabUrl();
      url = prompt("Nhập link medium:", url);

      if (url) {
        window.open("https://readmedium.com/" + url);
        // window.open("https://freedium.cfd/" + url);
      }
    },
  },
};
