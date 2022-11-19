export default {
  icon: `<i class="fa-regular fa-square-check"></i>`,
  name: {
    en: "Check fb access token",
    vi: "Kiểm tra fb access token",
  },
  description: {
    en: "Check type, permissions, created date, expired date, ...",
    vi: "Kiểm tra loại, quyền, ngày tạo, ngày hết hạn, ...",
  },
  runInExtensionContext: true,

  func: function () {
    let token = window.prompt(
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
};
