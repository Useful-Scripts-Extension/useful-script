export default {
  icon: '<i class="fa-solid fa-bookmark fa-lg"></i>',
  name: {
    en: "Open my facebook saved",
    vi: "Mở trang facebook saved",
  },
  description: {
    en: "View saved contents on Facebook",
    vi: "Xem nội dung tôi đã lưu trên Facebook",
  },
  onClickExtension: () => window.open("https://www.facebook.com/saved"),
};
