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
  whiteList: ["*://www.facebook.com"],

  func: function () {
    // Lấy user id (uid) - khi đang trong tường của người dùng muốn lấy user id. Ví dụ: https://www.facebook.com/callchoulnhe

    const found = (r) =>
      r && r[0] && window.prompt(`USER ID của ${document.title}:`, r[0]);

    return (
      found(/(?<=\/profile\.php\?id=)(.\d+?)($|(?=&))/.exec(location.href)) ||
      (() => {
        for (let a of Array.from(document.querySelectorAll("a"))) {
          if (
            found(
              /(?<=set\=(pb|picfp|ecnf|pob)\.)(.\d+?)($|(?=\.))/.exec(a.href)
            )
          )
            return true;
        }
        return false;
      })() ||
      found(
        /(?<=\"user\"\:\{\"id\"\:\")(.\d+?)(?=\")/.exec(document.body.innerHTML)
      ) ||
      window.prompt(
        "Không tìm thấy USER ID nào trong trang web!\nBạn có đang ở đúng trang profile chưa?\nTrang web Ví dụ: ",
        "https://www.facebook.com/callchoulnhe"
      )
    );
  },
};
