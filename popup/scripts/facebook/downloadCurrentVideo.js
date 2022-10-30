export default {
  name: {
    en: "Get download link of current video",
    vi: "Tải video đang xem",
  },
  description: {
    en: "Get download link of current video",
    vi: "Lấy link để tải video đang xem",
  },

  // Tải video đang xem - khi đang trong trang web video, dạng: https://www.facebook.com/watch?v=254222479732213
  // Nếu bạn muốn tải HD thì dùng snapsave: https://snapsave.app/vn
  func: function () {
    const found = (check) => {
      if (check && check[0]) {
        const url = window.location.href.replace(
          "www.facebook.com",
          "mbasic.facebook.com"
        );
        window.open(url);
        return true;
      }
      return false;
    };
    if (found(/(?<=\/watch\?v\=)(.\d+?)($|(?=\/))/.exec(location.href))) return;
    if (found(/(?<=videos\/)(.\d+?)($|(?=\/))/.exec(location.href))) return;
    window.prompt(
      "Không tìm thấy id của video trên url!\nBạn có ở đúng trang xem video chưa?\nTrang web ví dụ:",
      "https://www.facebook.com/watch?v=254222479732213"
    );
  },
};
