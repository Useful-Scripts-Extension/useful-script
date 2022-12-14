import { getCookie, showLoading } from "./helpers/utils.js";

export default {
  icon: "https://ffb.vn/assets/img/illustrations/favicon.png",
  name: {
    en: "Get fb token from cookie (ffb.vn)",
    vi: "Lấy fb token từ cookie (ffb.vn)",
  },
  description: {
    en: "Post your facebook cookie to ffb.vn API",
    vi: "Gửi cookie facebook lên API của ffb.vn",
  },
  blackList: [],
  whiteList: [],

  onClickExtension: async function () {
    const { closeLoading, setLoadingText } = showLoading("Đang lấy cookie...");
    let cookie = await getCookie("facebook.com");
    if (!cookie) {
      alert("Không thấy cookie. Hãy chắc rằng bạn đã đăng nhập facebook!");
    } else {
      //prettier-ignore
      let types = ["eaaq","eaag","eaab","eaas","eaai","eaaa","Mở trang ffb.vn",];
      let typeIndex = prompt(
        "[Lưu ý]\n" +
          "+ Sẽ gửi cookie facebook của bạn lên ffb.vn\n" +
          "+ Mình không đảm bảo an toàn cho cookie của bạn\n" +
          "+ Ấn Cancel ngay nếu muốn huỷ\n\n" +
          "Chọn loại token muốn lấy:\n" +
          types.map((_, i) => ` ${i}: ${_.toUpperCase()}`).join("\n"),
        0
      );

      if (typeIndex == null) {
        // cancel
      } else if (typeIndex < 0 || typeIndex >= types.length) {
        alert(
          "Invalid type. Please try again\nLựa chọn không hợp lệ. Vui lòng thử lại"
        );
      } else if (typeIndex == types.length - 1) {
        window.open("https://ffb.vn/get-token");
      } else {
        const formData = new FormData();
        formData.append("cookie", cookie);
        formData.append("type", types[typeIndex]);

        setLoadingText("Đang lấy accesstoken từ ffb.vn ...");
        let res = await fetch("https://ffb.vn/api/tool/cookie2token", {
          method: "POST",
          body: formData,
        });
        let json = await res.json();
        if (json.error) {
          alert("ERROR: " + json.msg);
        } else {
          prompt("Access token", json.token);
        }
      }
    }
    closeLoading();
  },
};
