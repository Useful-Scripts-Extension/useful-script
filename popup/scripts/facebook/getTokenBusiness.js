export default {
  name: {
    en: "Get Token (business.facebook.com)",
    vi: "Lấy token (business.facebook.com)",
  },
  description: {
    en: "Get facebook access token from business.facebook.com",
    vi: "Lấy facebook access token từ trang business.facebook.com",
  },
  func() {
    if (window.location.host !== "business.facebook.com") {
      alert(
        "Bookmark này chỉ hoạt động trên trang https://business.facebook.com/content_management/"
      );
      window.open("https://business.facebook.com/content_management/");
      return;
    }

    try {
      const accessToken =
        "EAAG" + /(?<=EAAG)(.*?)(?=\")/.exec(document.body.textContent)[0];
      window.prompt("Access Token của bạn:", accessToken);
    } catch (e) {
      alert("LỖI: " + e.message);
    }
  },
};
