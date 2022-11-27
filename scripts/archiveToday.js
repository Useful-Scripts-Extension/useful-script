import { getCurrentTab } from "./helpers/utils.js";

export default {
  icon: `https://archive.ph/favicon.ico`,
  name: {
    en: "Archive the current Page online",
    vi: "Lưu trữ online trang hiện tại",
  },
  description: {
    en: "Creates an archive of the current page on archive.today.",
    vi: "Lưu trang web hiện tại lên archive.today",
  },
  runInExtensionContext: true,

  func: async function () {
    let { url } = await getCurrentTab();

    var a = prompt(
      "Nhập URL muốn tạo archive: ",
      url.replace(/^http\:\/\/(.*)$/, "$1")
    );
    if (a != null) {
      window.open("https://archive.today/?run=1&url=" + encodeURIComponent(a));
    }
  },
};
