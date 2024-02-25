export default {
  icon: '<i class="fa-solid fa-bookmark fa-lg"></i>',
  name: {
    en: "View your facebook saved",
    vi: "Xem mục đã lưu trên facebook",
  },
  description: {
    en: "View saved contents on Facebook",
    vi: "Xem nội dung bạn đã lưu trên Facebook",
  },
  onClickExtension: () => window.open("https://www.facebook.com/saved"),
};
