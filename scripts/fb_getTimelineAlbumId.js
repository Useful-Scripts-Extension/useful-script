export default {
  name: {
    en: "Get id of fb timeline album",
    vi: "Tìm id của album fb chứa mọi ảnh tải lên",
  },
  description: {
    en: "Get timeline album id of page/user in current website",
    vi: "Tìm album chứa tất cả ảnh trên dòng thời gian của page/user hiện tại",
  },
  blackList: [],
  whiteList: ["*://www.facebook.com"],

  onClick: function () {
    // Lấy timeline album id của page - khi đang trong trang của page fb. Ví dụ: https://www.facebook.com/profile.php?id=100057998562930

    const page_name = document.title;
    const list_a = document.querySelectorAll("a");
    for (let a of Array.from(list_a)) {
      const posts_screen = /(?<=set\=a\.)(.\d+?)(?=\&__cft__)/.exec(a.href);
      if (posts_screen && posts_screen[0]) {
        prompt(
          `Timeline Album ID của ${page_name}:\n` +
            "- Bấm OK để mở album trong tab mới. Cancel để huỷ -",
          posts_screen[0]
        ) && window.open("https://www.facebook.com/" + posts_screen[0]);
        return;
      }
    }
    window.alert(
      "Không tìm thấy TIMELINE ALBUM trong trang web!\nBạn có đang ở đúng trang web của 1 Page/User fb chưa?"
    );
  },
};
