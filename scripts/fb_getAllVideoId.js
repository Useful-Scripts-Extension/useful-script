export default {
  name: {
    en: "Get all fb Video ID",
    vi: "Tìm tất cả fb video id",
  },
  description: {
    en: "Get id of all video in current website",
    vi: "Tìm tất cả video id trong trang web",
  },
  blackList: [],
  whiteList: ["*://www.facebook.com"],

  func: function () {
    const list_a = document.querySelectorAll("a");
    const list_id = [];
    for (let a of Array.from(list_a)) {
      const check = /(?<=\/videos\/)(.\d+?)($|(?=\/))/.exec(a.href);
      if (check && check[0]) {
        list_id.push(check[0]);
      }
    }
    if (list_id.length)
      window.prompt(
        `Tìm thấy ${list_id.length} video id: `,
        list_id.join(", ")
      );
    else
      window.prompt(
        "Không tìm thấy video id nào trong trang web!\nBạn có ở đúng trang video chưa?\nTrang web ví dụ:",
        "https://www.facebook.com/watch/?ref=tab"
      );
  },
};
