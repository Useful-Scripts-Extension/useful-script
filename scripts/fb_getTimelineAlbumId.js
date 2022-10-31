export default {
  name: {
    en: "Get timeline Album ID of fb page",
    vi: "Tìm timeline album id của fb page",
  },
  description: {
    en: "Get timeline album id of page in current website",
    vi: "Tìm timeline album id của page hiện tại",
  },
  blackList: [],
  whiteList: ["www.facebook.com"],

  // Lấy timeline album id của page - khi đang trong trang của page fb. Ví dụ: https://www.facebook.com/profile.php?id=100057998562930
  func: function () {
    const page_name = document.title;
    const list_a = document.querySelectorAll("a");
    for (let a of Array.from(list_a)) {
      const posts_screen = /(?<=set\=a\.)(.\d+?)(?=\&__cft__)/.exec(a.href);
      if (posts_screen && posts_screen[0]) {
        window.prompt(`Timeline Album ID của ${page_name}:`, posts_screen[0]) &&
          window.open("https://www.facebook.com/" + posts_screen[0]);
        return;
      }
    }
    window.prompt(
      "Không tìm thấy TIMELINE ALBUM trong trang web!\nBạn có đang ở đúng trang web của 1 Page fb chưa?\nThử kéo xuống tới bài post nào có kèm hình ảnh rồi ấn lại bookmark nhé\nTrang web Ví dụ: ",
      "https://www.facebook.com/profile.php?id=100057998562930"
    );
  },
};
