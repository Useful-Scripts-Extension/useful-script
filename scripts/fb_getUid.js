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
  whiteList: ["www.facebook.com"],

  // Lấy user id (uid) - khi đang trong tường của người dùng muốn lấy user id. Ví dụ: https://www.facebook.com/callchoulnhe
  func: function () {
    const user_name = document.title;
    const found = (check) => {
      if (check && check[0]) {
        window.prompt(`USER ID của ${user_name}:`, check[0]);
        return true;
      }
      return false;
    };
    if (found(/(?<=\/profile\.php\?id=)(.\d+?)($|(?=&))/.exec(location.href)))
      return;
    const list_a = document.querySelectorAll("a");
    for (let a of Array.from(list_a)) {
      if (
        found(/(?<=set\=(pb|picfp|ecnf|pob)\.)(.\d+?)($|(?=\.))/.exec(a.href))
      )
        return;
    }
    if (
      found(
        /(?<=\"user\"\:\{\"id\"\:\")(.\d+?)(?=\")/.exec(document.body.innerHTML)
      )
    )
      return;
    window.prompt(
      "Không tìm thấy USER ID nào trong trang web!\nBạn có đang ở đúng trang profile chưa?\nTrang web Ví dụ: ",
      "https://www.facebook.com/callchoulnhe"
    );
  },
};
