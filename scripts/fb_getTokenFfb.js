export default {
  icon: `<i class="fa-solid fa-arrow-up-right-from-square"></i>`,
  name: {
    en: "Get fb token full permission (ffb.vn)",
    vi: "Lấy token fb đủ quyền (ffb.vn)",
  },
  description: {
    en: "WARNING: I do not own this website. Be careful when use!",
    vi: "CẢNH BÁO: Không phải trang web của mình. Cẩn thận khi sử dụng!",
  },
  blackList: [],
  whiteList: [],
  func: function () {
    window.open("https://ffb.vn/get-token");
  },
};
