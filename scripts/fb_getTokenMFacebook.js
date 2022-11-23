import { showLoading } from "./helpers/utils.js";

export default {
  icon: `<i class="fa-solid fa-key"></i>`,
  name: {
    en: "Get fb Token (m.facebook.com)",
    vi: "Lấy fb token (m.facebook.com)",
  },
  description: {
    en: "Get facebook access token from m.facebook.com",
    vi: "Lấy facebook access token từ trang m.facebook.com",
  },
  runInExtensionContext: true,

  func: function () {
    const { closeLoading, setLoadingText } = showLoading("Đang lấy token ...");
    fetch("https://m.facebook.com/composer/ocelot/async_loader/?publisher=feed")
      .then((response) => response.text())
      .then((text) => {
        if ("<" == text[0]) {
          alert("Chưa đăng nhập. Bạn cần đăng nhập fb thì mới lấy được token.");
        } else {
          const data = {
            token: /(?<=accessToken\\":\\")(.*?)(?=\\")/.exec(text)?.[0],
            fb_dtsg: /(?<=fb_dtsg\\" value=\\")(.*?)(?=\\")/.exec(text)?.[0],
            id: /(?<=USER_ID\\":\\").*?(?=\\",\\")/gm.exec(text)?.[0],
          };
          console.log(data);
          if (data.token) {
            window.prompt("Access Token của bạn:", data.token);
          } else {
            alert("Không tìm thấy access token");
          }
        }
      })
      .catch((e) => {
        alert("ERROR: " + e.message);
      })
      .finally(closeLoading);
  },
};
