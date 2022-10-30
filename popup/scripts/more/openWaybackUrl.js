export default {
  name: {
    en: "Open wayback url",
    vi: "Xem wayback url của website",
  },
  description: {
    en: "Open wayback url for current website",
    vi: "Giúp xem nội dung website trong quá khứ",
  },
  func() {
    window.open("https://web.archive.org/web/*/" + location.href);
  },
};
