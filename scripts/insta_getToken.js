export default {
  icon: "https://www.instagram.com/favicon.ico",
  name: {
    en: "Get token insta",
    vi: "Lấy token insta",
  },
  description: {
    en: "Get instagram access token",
    vi: "Lấy instagram access token",
  },
  blackList: [],
  whiteList: ["*://*.instagram.com"],

  func: function () {
    try {
      const encoded = document.cookie
        .split("; ")
        ?.find((_) => _.startsWith("fbsr"))
        ?.split(".")[1];
      if (encoded) {
        const decoded = JSON.parse(atob(encoded));
        console.log(decoded);
        window.prompt("Access token: ", decoded.oauth_token);
      } else {
        alert(
          "Không tìm thấy thông tin access token trong cookie!\nBạn đã đăng nhập instagram chưa??"
        );
      }
    } catch (e) {
      alert("Lỗi: " + e.toString());
    }
  },
};
