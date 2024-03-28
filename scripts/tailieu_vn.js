import { getCurrentTabUrl } from "./helpers/utils.js";

export default {
  icon: "https://s2.googleusercontent.com/s2/favicons?domain_url=https://tailieu.vn/tim-kiem/lu%E1%BA%ADt.html",
  name: {
    en: "Download free from tailieu.vn",
    vi: "Tải miễn phí từ tailieu.vn",
  },
  description: {
    en: "Download any document on tailieu.vn without login",
    vi: "Tải bất kỳ tài liệu nào trên tailieu.vn không cần đăng nhập",
  },

  whiteList: ["https://tailieu.vn/*"],

  onClickExtension: async () => {
    // change location from tailieu.vn to tailieu.download
    let url = await getCurrentTabUrl();
    url = new URL(url);
    url.hostname = "tailieu.download";
    window.open(url.href, "_blank");
  },
};
