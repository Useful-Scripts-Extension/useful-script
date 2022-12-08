import { getCurrentTab } from "./helpers/utils.js";

export default {
  icon: '<i class="fa-solid fa-shield-halved"></i>',
  name: {
    en: "View blocked websites",
    vi: "Truy cập các trang web bị chặn",
  },
  description: {
    en: "View website that being blocked. (eg. Medium)",
    vi: "Xem các website đang bị chặn bởi nhà mạng. (ví dụ: Medium)",
  },
  runInExtensionContext: true,

  onClick: async function () {
    // Post: https://www.facebook.com/groups/j2team.community/posts/1772972649701514/

    let tab = await getCurrentTab();
    let url = prompt("Nhập trang web bị chặn mà bạn muốn truy cập:", tab?.url);
    if (url != null) window.open("https://donotblock.me/" + url);
  },
};
