export default {
  name: {
    en: "Open repo in github1s.com",
    vi: "Mở repo trong github1s.com",
  },
  description: {
    en: "Open current repo in github1s.com",
    vi: "Mở repo hiện tại trong trang github1s.com để xem code",
  },
  func() {
    window.open("https://www.github1s.com" + location.pathname);
  },
};
