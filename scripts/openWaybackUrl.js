import { getCurrentTab } from "./helpers/utils.js";

export default {
  icon: "https://archive.org/images/glogo.jpg",
  name: {
    en: "Open wayback url",
    vi: "Xem wayback url của website",
  },
  description: {
    en: "Open wayback url for website",
    vi: "Giúp xem nội dung website trong quá khứ",
  },

  popupScript: {
    onClick: async function () {
      let { url } = await getCurrentTab();
      let url_to_check = prompt("Nhập URL muốn xem: ", url);
      if (url_to_check) {
        window.open("https://web.archive.org/web/*/" + url_to_check);
      }
    },
  },
};
