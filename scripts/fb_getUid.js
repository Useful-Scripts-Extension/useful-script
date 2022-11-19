export default {
  icon: `<i class="fa-regular fa-id-card"></i>`,
  name: {
    en: "Get fb User ID",
    vi: "Lấy fb User ID",
  },
  description: {
    en: "Get id of user in current website",
    vi: "Lấy id của user trong trang web hiện tại",
  },
  blackList: [],
  whiteList: ["https://www.facebook.com"],

  func: function () {
    // Lấy user id (uid) - khi đang trong tường của người dùng muốn lấy user id. Ví dụ: https://www.facebook.com/callchoulnhe

    const find = (r) => (r ? r[0] : 0);

    let uid =
      find(
        /(?<=\"userID\"\:\")(.\d+?)(?=\")/.exec(
          document.querySelector("html").textContent
        )
      ) ||
      find(/(?<=\/profile\.php\?id=)(.\d+?)($|(?=&))/.exec(location.href)) ||
      (() => {
        for (let a of Array.from(document.querySelectorAll("a"))) {
          let _ = find(
            /(?<=set\=(pb|picfp|ecnf|pob)\.)(.\d+?)($|(?=\.))/.exec(a.href)
          );
          if (_) return _;
        }
        return 0;
      })() ||
      find(
        /(?<=\"user\"\:\{\"id\"\:\")(.\d+?)(?=\")/.exec(document.body.innerHTML)
      );

    if (uid) window.prompt(`USER ID của ${document.title}:`, uid);
    else
      window.prompt(
        "Không tìm thấy USER ID nào trong trang web!\nBạn có đang ở đúng trang profile chưa?\nTrang web Ví dụ: ",
        "https://www.facebook.com/callchoulnhe"
      );
  },
};
