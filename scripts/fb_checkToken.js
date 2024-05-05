export default {
  icon: `<i class="fa-regular fa-square-check fa-lg"></i>`,
  name: {
    en: "Check fb access token",
    vi: "Kiểm tra fb access token",
  },
  description: {
    en: "Check type, permissions, created date, expired date, ... of faceboook access token",
    vi: "Kiểm tra loại, quyền, ngày tạo, ngày hết hạn, ... của facebook access token",
  },

  popupScript: {
    onClick: function () {
      let token = prompt(
        "Enter accesstoken want to check\nNhập access token muốn kiểm tra:",
        ""
      );
      if (token) {
        window.open(
          "https://developers.facebook.com/tools/debug/accesstoken/?access_token=" +
            token
        );
      }
    },
  },
};
