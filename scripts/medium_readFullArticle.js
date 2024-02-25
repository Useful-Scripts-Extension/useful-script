// javascript:window.open("https://freedium.cfd/"+encodeURIComponent(window.location))

export default {
  icon: "https://s2.googleusercontent.com/s2/favicons?domain=freedium.cfd",
  name: {
    en: "Read full medium article",
    vi: "Đọc bài viết medium full",
  },
  description: {
    en: "Read full medium article without login",
    vi: "Đọc bài viết medium full không cần đăng nhập",
  },

  whiteList: ["https://medium.com/*"],

  onClick: () => {
    window.open("https://freedium.cfd/" + encodeURIComponent(window.location));
  },
};
