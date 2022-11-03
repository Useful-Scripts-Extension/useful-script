export default {
  icon: "https://archive.org/web/images/logo_wayback_210x77.png",
  name: {
    en: "Open wayback url",
    vi: "Xem wayback url của website",
  },
  description: {
    en: "Open wayback url for current website",
    vi: "Giúp xem nội dung website trong quá khứ",
  },
  func: function () {
    window.open("https://web.archive.org/web/*/" + location.href);
  },
};
