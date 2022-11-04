export default {
  icon: `<i class="fa-solid fa-key"></i>`,
  name: {
    en: "Get fb Token (business.facebook.com)",
    vi: "Lấy fb token (business.facebook.com)",
  },
  description: {
    en: "Get facebook access token from business.facebook.com",
    vi: "Lấy facebook access token từ trang business.facebook.com",
  },
  blackList: [],
  whiteList: ["business.facebook.com"],

  func: function () {
    try {
      const accessToken =
        "EAAG" + /(?<=EAAG)(.*?)(?=\")/.exec(document.body.textContent)[0];
      window.prompt("Access Token của bạn:", accessToken);
    } catch (e) {
      alert("LỖI: " + e.message);
    }
  },
};
